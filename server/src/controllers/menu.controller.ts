import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import PDFDocument from 'pdfkit';
import path from 'path';

// Group products by category
const groupByCategory = (products: any[]) => {
  const grouped: Record<string, any[]> = {
    'petit-dejeuner': [],
    'plats-chauds': [],
    'boissons': [],
  };

  products.forEach((product) => {
    if (grouped[product.category]) {
      grouped[product.category].push(product);
    }
  });

  return grouped;
};

// Get category label based on language
const getCategoryLabel = (category: string, lang: 'fr' | 'ar' | 'en' = 'fr'): string => {
  const labels: Record<string, Record<string, string>> = {
    'petit-dejeuner': {
      fr: 'Petit-Déjeuner',
      ar: 'فطور',
      en: 'Breakfast',
    },
    'plats-chauds': {
      fr: 'Plats Chauds',
      ar: 'أطباق ساخنة',
      en: 'Hot Meals',
    },
    'boissons': {
      fr: 'Boissons',
      ar: 'مشروبات',
      en: 'Beverages',
    },
  };

  return labels[category]?.[lang] || category;
};

// Generate PDF menu
export const downloadMenuPDF = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lang = (req.query.lang as 'fr' | 'ar' | 'en') || 'fr';
    
    // Get all available products
    const products = await Product.find({ isAvailable: true }).sort({ category: 1, price: 1 });
    const grouped = groupByCategory(products);

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      layout: 'portrait',
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=menu-buvette-ehtp.pdf');

    // Pipe PDF to response
    doc.pipe(res);

    // Header with background color
    const headerHeight = 160;
    // A4 page width is exactly 595.28 points
    const pageWidth = 595.28;
    doc
      .fillColor('#2563eb')
      .rect(0, 0, pageWidth, headerHeight)
      .fill();

    // Add logo - centered on the header (both horizontally and vertically)
    try {
      const logoPath = path.join(process.cwd(), '..', 'client', 'public', 'ehtpbuvettelogo.png');
      const logoWidth = 250;
      const logoHeight = 150;
      // Calculate exact center position for horizontal centering
      const logoX = (pageWidth - logoWidth) / 2;
      // Calculate exact center position for vertical centering in header
      const logoY = (headerHeight - logoHeight) / 2;
      // Position the image at the calculated center coordinates
      doc.image(logoPath, logoX, logoY, { 
        fit: [logoWidth, logoHeight]
      });
    } catch (error) {
      // If logo not found, use text as fallback
      console.warn('Logo not found, using text fallback:', error);
      doc
        .fillColor('#ffffff')
        .fontSize(32)
        .font('Helvetica-Bold')
        .text('Buvette EHTP', 0, (headerHeight - 40) / 2, { align: 'center', width: pageWidth });
    }

    // Reset to black text and move down
    doc.fillColor('#000000');
    doc.y = headerHeight + 10;

    // Draw a decorative line
    doc
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .strokeColor('#d1d5db')
      .lineWidth(2)
      .stroke();

    doc.moveDown(1);

    // Categories
    const categories = ['petit-dejeuner', 'plats-chauds', 'boissons'];
    
    categories.forEach((category) => {
      const categoryProducts = grouped[category];
      if (categoryProducts.length === 0) return;

      // Category title with background
      const categoryTitle = getCategoryLabel(category, lang);
      const titleY = doc.y;
      
      doc
        .fillColor('#f3f4f6')
        .roundedRect(50, titleY - 5, 500, 30, 5)
        .fill();

      doc
        .fillColor('#1f2937')
        .fontSize(18)
        .font('Helvetica-Bold')
        .text(categoryTitle, 60, titleY, { width: 480 });

      doc.y = titleY + 30;
      doc.moveDown(0.3);

      // Products in this category
      categoryProducts.forEach((product) => {
        const productName = product.name[lang] || product.name.fr;
        const price = product.price.toFixed(2);
        const currentY = doc.y;

        // Check if we need a new page
        if (currentY > doc.page.height - 100) {
          doc.addPage();
        }

        // Product name and price
        const productY = doc.y;
        doc
          .fontSize(11)
          .fillColor('#374151')
          .font('Helvetica')
          .text(productName, 60, productY, { width: 350 });

        // Price aligned to the right
        doc
          .fontSize(11)
          .fillColor('#2563eb')
          .font('Helvetica-Bold')
          .text(`${price} MAD`, 410, productY, { width: 130, align: 'right' });

        // Draw a subtle line under product
        const lineY = productY + 15;
        doc
          .moveTo(60, lineY)
          .lineTo(540, lineY)
          .strokeColor('#f3f4f6')
          .lineWidth(0.5)
          .stroke();

        doc.y = productY + 20;
      });

      doc.moveDown(1.2);
    });

    // Add footer to last page
    const footerY = doc.page.height - 60;
    
    // Only add footer if we have space
    if (doc.y < footerY - 30) {
      doc.y = footerY - 30;
      
      // Footer line
      doc
        .moveTo(50, footerY)
        .lineTo(550, footerY)
        .strokeColor('#e5e7eb')
        .lineWidth(1)
        .stroke();

      // Footer text
      doc
        .fontSize(9)
        .fillColor('#6b7280')
        .font('Helvetica')
        .text(
          'École Hassania des Travaux Publics - Buvette',
          50,
          footerY + 10,
          { align: 'center', width: 500 }
        )
        .fontSize(8)
        .text(
          `Généré le ${new Date().toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}`,
          50,
          footerY + 25,
          { align: 'center', width: 500 }
        );
    }

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error('Error generating PDF menu:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Error generating PDF menu',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      });
    } else {
      next(error);
    }
  }
};

// Generate menu image (PNG)
export const downloadMenuImage = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // For now, redirect to PDF as generating images server-side requires canvas library
    // This is a placeholder - you can implement with canvas or puppeteer later
    res.status(501).json({
      success: false,
      message: 'Image generation not yet implemented. Please use PDF format.',
    });
  } catch (error) {
    next(error);
  }
};

