import mongoose from 'mongoose';
import { PickupLine } from './models/pickupLine.js';
import { pickupLinesByCategory } from './data/pickupLines.js';

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/pickuplines');
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await PickupLine.deleteMany({});
    console.log('Cleared existing data');
    
    const pickupLines = [];
    const styles = ['funny', 'romantic'];
    
    // Convert existing data format to database format
    for (const [category, lines] of Object.entries(pickupLinesByCategory)) {
      lines.forEach((text, index) => {
        // Alternate between funny and romantic, or you can use random assignment
        // const randomStyle = styles[Math.floor(Math.random() * styles.length)];
        const style = styles[index % 2]; // Alternates between styles
        
        pickupLines.push({
          category,
          text,
          burmese_text: text,
          style,
          length: 'short',
          quality_score: 75,
          safety_score: 95,
          review_status: 'approved',
          tags: [category, style],
          source_url: '',
          license_note: '',
          english_source_text: '',
          language: 'my'
        });
      });
    }
    
    // Insert all pickup lines
    await PickupLine.insertMany(pickupLines);
    console.log(`Successfully seeded ${pickupLines.length} pickup lines`);
    
    // Print summary of seeded data
    const summary = await PickupLine.aggregate([
      {
        $group: {
          _id: {
            category: '$category',
            style: '$style'
          },
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('\nSeeded data summary:');
    summary.forEach(item => {
      console.log(`${item._id.category} (${item._id.style}): ${item.count} lines`);
    });
    
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
