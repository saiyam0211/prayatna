const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { anyAuth } = require('../middleware/auth');
const Student = require('../models/Student');

const router = express.Router();

// Configure multer for different types of uploads
const createMulterConfig = (destination, allowedTypes) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '..', 'uploads', destination);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed. Allowed types: ${allowedTypes.join(', ')}`), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit
    }
  });
};

// Image upload configuration
const imageUpload = createMulterConfig('images', [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp'
]);

// Document upload configuration
const documentUpload = createMulterConfig('documents', [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/jpg',
  'image/png'
]);

// Avatar upload (single image with processing)
router.post('/avatar', anyAuth, imageUpload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = req.user;
    const userRole = req.userRole;

    // Process and resize avatar image
    const outputPath = path.join(req.file.destination, 'processed-' + req.file.filename);
    
    await sharp(req.file.path)
      .resize(200, 200, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    // Delete original file
    fs.unlinkSync(req.file.path);

    // Update user avatar
    const avatarUrl = `/uploads/images/processed-${req.file.filename}`;
    user.profile.avatar = avatarUrl;
    await user.save();

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatarUrl,
        filename: 'processed-' + req.file.filename
      }
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading avatar'
    });
  }
});

// Post images upload (multiple images)
router.post('/post-images', anyAuth, imageUpload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const processedImages = [];

    for (const file of req.files) {
      // Process each image
      const outputPath = path.join(file.destination, 'post-' + file.filename);
      
      await sharp(file.path)
        .resize(800, 600, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 85 })
        .toFile(outputPath);

      // Delete original file
      fs.unlinkSync(file.path);

      processedImages.push({
        url: `/uploads/images/post-${file.filename}`,
        filename: 'post-' + file.filename,
        originalName: file.originalname
      });
    }

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        images: processedImages,
        totalImages: processedImages.length
      }
    });

  } catch (error) {
    console.error('Post images upload error:', error);
    
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading images'
    });
  }
});

// Achievement media upload
router.post('/achievement-media', anyAuth, imageUpload.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = req.user;
    
    // Only students can upload achievement media
    if (req.userRole !== 'student') {
      // Clean up file
      fs.unlinkSync(req.file.path);
      return res.status(403).json({
        success: false,
        message: 'Only students can upload achievement media'
      });
    }

    // Process achievement image
    const outputPath = path.join(req.file.destination, 'achievement-' + req.file.filename);
    
    await sharp(req.file.path)
      .resize(600, 400, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toFile(outputPath);

    // Delete original file
    fs.unlinkSync(req.file.path);

    const mediaUrl = `/uploads/images/achievement-${req.file.filename}`;

    res.json({
      success: true,
      message: 'Achievement media uploaded successfully',
      data: {
        mediaUrl,
        filename: 'achievement-' + req.file.filename,
        originalName: req.file.originalname
      }
    });

  } catch (error) {
    console.error('Achievement media upload error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading achievement media'
    });
  }
});

// Marksheet upload for education analysis
router.post('/marksheets', anyAuth, documentUpload.array('marksheets', 3), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No marksheets uploaded'
      });
    }

    const user = req.user;
    
    // Only students can upload marksheets
    if (req.userRole !== 'student') {
      // Clean up files
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
      return res.status(403).json({
        success: false,
        message: 'Only students can upload marksheets'
      });
    }

    const marksheets = [];

    for (const file of req.files) {
      let processedPath = file.path;
      
      // If it's an image, compress it
      if (file.mimetype.startsWith('image/')) {
        const outputPath = path.join(file.destination, 'marksheet-' + file.filename);
        
        await sharp(file.path)
          .resize(1200, 1600, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 90 })
          .toFile(outputPath);

        // Delete original
        fs.unlinkSync(file.path);
        processedPath = outputPath;
      }

      marksheets.push({
        url: `/uploads/documents/${path.basename(processedPath)}`,
        filename: path.basename(processedPath),
        originalName: file.originalname,
        type: file.mimetype,
        uploadedAt: new Date()
      });
    }

    // Update student's education records
    if (!user.education) {
      user.education = { marksheets: [] };
    }
    
    // Replace old marksheets with new ones
    user.education.marksheets = marksheets;
    user.education.lastUpdated = new Date();
    
    await user.save();

    // TODO: Trigger AI analysis of marksheets here
    // This would call the skill analysis service to update student.skillMarks
    
    res.json({
      success: true,
      message: 'Marksheets uploaded successfully',
      data: {
        marksheets,
        totalFiles: marksheets.length,
        analysisStatus: 'pending' // Would be updated after AI analysis
      }
    });

  } catch (error) {
    console.error('Marksheet upload error:', error);
    
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading marksheets'
    });
  }
});

// School documents upload (logos, certificates, etc.)
router.post('/school-documents', anyAuth, imageUpload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Only schools can upload school documents
    if (req.userRole !== 'school') {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({
        success: false,
        message: 'Only schools can upload school documents'
      });
    }

    const user = req.user;
    const { type } = req.body; // 'logo', 'banner', 'certificate', etc.

    let outputPath = req.file.path;
    let filename = req.file.filename;

    // Process based on document type
    if (type === 'logo') {
      const logoPath = path.join(req.file.destination, 'logo-' + req.file.filename);
      
      await sharp(req.file.path)
        .resize(300, 300, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .png({ quality: 90 })
        .toFile(logoPath);

      fs.unlinkSync(req.file.path);
      outputPath = logoPath;
      filename = 'logo-' + req.file.filename;
      
      // Update school logo
      user.profile.logo = `/uploads/images/${filename}`;
      
    } else if (type === 'banner') {
      const bannerPath = path.join(req.file.destination, 'banner-' + req.file.filename);
      
      await sharp(req.file.path)
        .resize(1200, 400, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 85 })
        .toFile(bannerPath);

      fs.unlinkSync(req.file.path);
      outputPath = bannerPath;
      filename = 'banner-' + req.file.filename;
      
      // Update school banner
      user.profile.banner = `/uploads/images/${filename}`;
    }

    await user.save();

    const documentUrl = `/uploads/images/${filename}`;

    res.json({
      success: true,
      message: 'School document uploaded successfully',
      data: {
        documentUrl,
        filename,
        type,
        originalName: req.file.originalname
      }
    });

  } catch (error) {
    console.error('School document upload error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading school document'
    });
  }
});

// Get uploaded file (serve static files)
router.get('/files/:type/:filename', (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', type, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Security check - prevent directory traversal
    const normalizedPath = path.normalize(filePath);
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    
    if (!normalizedPath.startsWith(uploadsDir)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Serve the file
    res.sendFile(normalizedPath);

  } catch (error) {
    console.error('File serve error:', error);
    res.status(500).json({
      success: false,
      message: 'Error serving file'
    });
  }
});

// Delete uploaded file
router.delete('/files/:type/:filename', anyAuth, async (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', type, filename);
    const user = req.user;

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Security check - prevent directory traversal
    const normalizedPath = path.normalize(filePath);
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    
    if (!normalizedPath.startsWith(uploadsDir)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check permissions (users can only delete their own files or school admin can delete any)
    // This is a simplified check - in production, you'd want more robust file ownership tracking
    
    // Delete the file
    fs.unlinkSync(normalizedPath);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('File delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file'
    });
  }
});

// Get file info without serving the actual file
router.get('/info/:type/:filename', anyAuth, (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', type, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    
    res.json({
      success: true,
      data: {
        filename,
        type,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        url: `/api/upload/files/${type}/${filename}`
      }
    });

  } catch (error) {
    console.error('File info error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting file info'
    });
  }
});

module.exports = router; 