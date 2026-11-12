// REFERENCE ONLY, not used by the site any more. The website now reads the menu from the billing database.
// Kept so the descriptions and "what's included" text can be copied into the billing app
// (Settings → Services & prices). Prices here are the old rate card.

// Habib’s Fuljhore service catalogue — source: salon rate card.
// Edit prices here. Every price on the site (search, catalogue, booking totals, price preview) is read from this file.
// Shape per item: { n: name, p: [prices], lbl?: size labels, from?: starting price, sized?: S/M/L pricing, inc?: inclusions, sub?: detail }
export const CATALOGUE = [
  { id: 'haircut', title: 'Haircut', cat: 'hair', tab: 'Cuts & Styling', type: 'Cut & Style',
    desc: 'Precision cuts and finishing for women, men and children, plus shaving and beard grooming.',
    items: [
      { n: 'Ladies Cut and Styling', p: [800, 899] },
      { n: 'Men Cut and Styling', p: [600, 699] },
      { n: 'Fringe Haircut', p: [400, 499] },
      { n: 'Shaving', p: [350] },
      { n: 'Men Head Shave', p: [350] },
      { n: 'Beard Color', p: [350] },
      { n: 'Beard Trimming', p: [350] },
      { n: 'Beard Styling', p: [250] },
      { n: 'Child Cut Boy (Under 10 Years)', p: [299, 350] },
      { n: 'Child Cut Girl (Under 10 Years)', p: [450, 499] }
    ] },
  { id: 'blowdry', title: 'Blow Dry', cat: 'hair', tab: 'Cuts & Styling', type: 'Cut & Style',
    desc: 'Wash and dry services for a clean, polished everyday finish.',
    items: [
      { n: 'Ladies Wash and Blast Dry', p: [499] },
      { n: 'Men Wash and Blast Dry', p: [300] },
      { n: 'Blow Dry (S/M/L)', p: [599, 699], sized: true }
    ] },
  { id: 'blowdry-styling', title: 'Blow Dry Styling', cat: 'hair', tab: 'Cuts & Styling', type: 'Cut & Style',
    desc: 'Styled finishes from smooth blow-drys to crimps, curls and roller sets.',
    items: [
      { n: 'Ultimate Blowdry (S/M/L)', p: [750, 850], sized: true },
      { n: 'Crimping / Ironing (S/M/L)', p: [900, 1100], sized: true },
      { n: 'Tongs / Roller Set (S/M/L)', p: [1100, 1300], sized: true }
    ] },
  { id: 'head-massage', title: 'Head Massage', cat: 'hair', tab: 'Cuts & Styling', type: 'Spa & Treatment',
    desc: 'Relaxing oil massages for the scalp.',
    items: [
      { n: 'Coconut Oil', p: [500, 600] },
      { n: 'Habibs Oil', p: [500, 600] },
      { n: 'Aroma Oil', p: [500, 600] }
    ] },
  { id: 'highlights', title: 'Hair Highlights', cat: 'hair', tab: 'Colour', type: 'Colour',
    desc: 'Highlights placed at the crown, T-section or across the full head.',
    note: 'Additional charge of ₹750 for extra thick hair.',
    items: [
      { n: 'Men Highlights', p: [1500] },
      { n: 'Crown (S/M/L)', p: [2500, 3000, 3500], lbl: ['S', 'M', 'L'], sized: true },
      { n: 'T Section (S/M/L)', p: [3000, 3500, 4000], lbl: ['S', 'M', 'L'], sized: true },
      { n: 'Full Highlight (S/M/L)', p: [4500, 5000, 5500], lbl: ['S', 'M', 'L'], sized: true }
    ] },
  { id: 'advance-color', title: 'Advance Hair Color', cat: 'hair', tab: 'Colour', type: 'Colour',
    desc: 'Blended colour techniques including ombre, sombre and balayage.',
    items: [
      { n: 'Omber (S/M/L)', p: [4000, 4500, 5000], lbl: ['S', 'M', 'L'], sized: true },
      { n: 'Sombre (S/M/L)', p: [5000, 5500, 6000], lbl: ['S', 'M', 'L'], sized: true },
      { n: 'Balayage (S/M/L)', p: [6000, 6500, 7000], lbl: ['S', 'M', 'L'], sized: true },
      { n: 'Color Shine (S/M/L)', p: [1500, 1750, 2000], lbl: ['S', 'M', 'L'], sized: true },
      { n: 'Pre-Lightening for Hair Color', p: [1500], from: true },
      { n: 'Per Streak', p: [600] }
    ] },
  { id: 'color', title: 'Color', cat: 'hair', tab: 'Colour', type: 'Colour',
    desc: 'Root touch-ups and global colour for men and women.',
    note: 'Additional 20% for Ammonia Free Colors.',
    items: [
      { n: 'Root Touch Up', p: [1500] },
      { n: 'Global - Men', p: [1500] },
      { n: 'Global Women (S/M/L)', p: [3000, 3500, 4000, 4500], sized: true }
    ] },
  { id: 'hair-spa', title: 'Hair Spa', cat: 'hair', tab: 'Spa & Treatments', type: 'Spa & Treatment',
    desc: 'Nourishing spa rituals and repair treatments for healthier-feeling hair.',
    items: [
      { n: 'Loreal Hair Spa Men (Oriental/Deluxe)', p: [900, 1000] },
      { n: 'Loreal Hair Spa Women (S/M/L)', p: [2000], sized: true },
      { n: 'Keratin Spa', p: [2999], from: true },
      { n: 'Plex Bond Repairing Treatment Spa', p: [2500] },
      { n: 'Moraccan Hair Treatment Spa', p: [2500] }
    ] },
  { id: 'smoothening', title: 'Smoothening / Straightening / Rebonding', cat: 'hair', tab: 'Spa & Treatments', type: 'Spa & Treatment', consult: true, length: true,
    desc: 'Priced by hair length, from fringe to waist.',
    note: 'Additional charge of ₹1000 for extra thick hair.',
    items: [
      { n: 'Fringe', p: [2500] },
      { n: 'Crown Area', p: [3500] },
      { n: 'Bob Length', p: [4000] },
      { n: 'Shoulder Length', p: [5500] },
      { n: 'Below Shoulder', p: [6500] },
      { n: 'Upto Waist', p: [7500] }
    ] },
  { id: 'keratin', title: 'Keratin / Cystein Treatment', cat: 'hair', tab: 'Spa & Treatments', type: 'Spa & Treatment', consult: true, length: true,
    desc: 'Priced by hair length.',
    note: 'Additional ₹1000 for extra thick hair.',
    items: [
      { n: 'Bob Length', p: [5000] },
      { n: 'Shoulder Length', p: [6000] },
      { n: 'Below Shoulder', p: [7000] },
      { n: 'Upto Waist', p: [8000], from: true }
    ] },
  { id: 'nano', title: 'Nano-Active / Plastia Treatment', cat: 'hair', tab: 'Spa & Treatments', type: 'Spa & Treatment', consult: true, length: true,
    desc: 'Priced by hair length.',
    note: 'Additional ₹1000 for extra thick hair.',
    items: [
      { n: 'Bob Length', p: [7000] },
      { n: 'Shoulder Length', p: [8000] },
      { n: 'Below Shoulder', p: [9000] },
      { n: 'Upto Waist', p: [10000], from: true }
    ] },
  { id: 'botox', title: 'Botox / Botoplex Treatment', cat: 'hair', tab: 'Spa & Treatments', type: 'Spa & Treatment', consult: true, length: true,
    desc: 'Priced by hair length.',
    note: 'Additional ₹1000 for extra thick hair.',
    items: [
      { n: 'Bob Length', p: [5500] },
      { n: 'Shoulder Length', p: [6500] },
      { n: 'Below Shoulder', p: [7500] },
      { n: 'Upto Waist', p: [8500], from: true }
    ] },
  { id: 'makeup', title: 'Makeup Services', cat: 'makeup', type: 'Makeup & Styling', consult: true,
    desc: 'Bridal and reception makeup by our makeup team.',
    items: [
      { n: 'Bridal Makeup Service', p: [10000], from: true },
      { n: 'Reception Makeup Service', p: [10000], from: true }
    ] },
  { id: 'bridal-package', title: 'Bridal Package', cat: 'bridal', type: 'Package', consult: true,
    desc: 'Bride Package A + B — ₹20,000+',
    items: [
      { n: 'Bride Package A + B', p: [20000], from: true, sub: 'Pre-Bridal Package + Wedding Day Package' },
      { n: 'A. Pre-Bridal Package', p: [10000], from: true, sub: '5 days prior', inc: ['Full Body Waxing', 'Full Body Bleach', 'Full Face Threading', 'Spa Manicure', 'Spa Pedicure', 'Hair Cut', 'Hair Spa', 'Whitening Facial', 'Skin Polishing'] },
      { n: 'B. Wedding Day Package', p: [10000], from: true, inc: ['Bridal Make-up', 'Hair Styling', 'Saree Draping'] },
      { n: 'Wedding Premium', p: [3000], from: true, sub: 'Function make-up for friends and relatives of the bride/groom' },
      { n: 'Reception', p: [6000], from: true, sub: 'Contemporary wedding make-up for any culture with dressing and hairstyling.' }
    ] },
  { id: 'groom-package', title: 'Groom Package', cat: 'groom', type: 'Package', consult: true,
    desc: 'Grooming packages for the days before the wedding and the day itself.',
    items: [
      { n: 'A. Pre-Bridal Package (Groom)', p: [7000], inc: ['Hair Cut + Trim', 'Manicure', 'Pedicure', 'Face Tanpack', 'Hair Spa / Hair Color', 'Habibs Special Groom Facial'] },
      { n: 'B. Advance Groom Package', p: [10000], from: true, inc: ['Hair Cut + Trim', 'Manicure Spa', 'Pedicure Spa', 'Face Tanpack', 'Hair Spa / Hair Color', 'Body Polishing', 'Habibs Special Groom Facial'] },
      { n: 'C. Wedding Day - Groom', p: [4000], sub: 'Wedding Day Make-Up for the Groom.' }
    ] },
  { id: 'makeup-styling', title: 'Makeup / Hairstyle / Saree Draping', cat: 'makeup', type: 'Makeup & Styling',
    desc: 'Occasion makeup and saree draping.',
    items: [
      { n: 'Saree Draping', p: [500] },
      { n: 'Simple Make-Up', p: [1000], from: true, sub: 'Foundation + Eye Liner + Lipstick' },
      { n: 'Party Make-Up', p: [1500], from: true, sub: 'Foundation + Eye Liner + Eyeshadow + Blush On + Lipstick' }
    ] },
  { id: 'upstyles', title: 'Up Styles', cat: 'makeup', type: 'Makeup & Styling',
    desc: 'Braids and occasion hairstyles.',
    items: [
      { n: 'Braids', p: [500] },
      { n: 'Formal / Informal', p: [1200] }
    ] },
  { id: 'dtan', title: 'D-Tan / Bleach', cat: 'beauty', tab: 'D-Tan & Bleach', type: 'Skin & Facial',
    desc: 'De-tan and bleach for face and body.',
    items: [
      { n: 'Upper Lip', p: [150] }, { n: 'Face & Neck', p: [700] }, { n: 'Back Neck', p: [350] },
      { n: 'Under Arms', p: [200] }, { n: 'Full Arms', p: [799] }, { n: 'Full Legs', p: [1999] },
      { n: 'Half Arms', p: [699] }, { n: 'Half Legs', p: [999] }, { n: 'Full Back or Front', p: [999] },
      { n: 'Half Back or Stomach', p: [800] }, { n: 'Feet or Palms', p: [500] }, { n: 'Full Body', p: [3999] }
    ] },
  { id: 'mask', title: 'Add-On Mask', cat: 'beauty', tab: 'D-Tan & Bleach', type: 'Skin & Facial',
    desc: 'Masks that can be added to a skin service.',
    items: [
      { n: 'Whitening', p: [600] }, { n: 'Firming', p: [700] },
      { n: 'Premium (O3+, Goje, etc.)', p: [1000], from: true }, { n: 'Peel Off Masks', p: [] }
    ] },
  { id: 'threading', title: 'Body Basics Threading', cat: 'beauty', tab: 'Threading', type: 'Hair Removal',
    desc: 'Threading for brows and face.',
    items: [
      { n: 'Eyebrows', p: [50] }, { n: 'Forehead', p: [40] }, { n: 'Upper Lips', p: [40] }, { n: 'Chin', p: [40] },
      { n: 'Side Locks', p: [100] }, { n: 'Full Face Threading', p: [500] }, { n: 'Mens Threading', p: [70] }
    ] },
  { id: 'wax', title: 'Regular Waxing', cat: 'beauty', tab: 'Waxing', type: 'Hair Removal',
    desc: 'Regular wax for face and body.',
    items: [
      { n: 'Chin', p: [70] }, { n: 'Upperlips', p: [70] }, { n: 'Eyebrows', p: [80] }, { n: 'Forehead', p: [80] },
      { n: 'Sidelocks', p: [100] }, { n: 'Full Face', p: [800] }, { n: 'Underarms', p: [300] }, { n: 'Half Arms', p: [500] },
      { n: 'Full Arms', p: [700] }, { n: 'Half Legs', p: [600] }, { n: 'Full Legs', p: [900] },
      { n: 'Rica Full Legs Wax', p: [1100] }, { n: 'Back Waxing', p: [800] }, { n: 'Full Body Waxing', p: [2500] }
    ] },
  { id: 'rica', title: 'Rica Wax', cat: 'beauty', tab: 'Waxing', type: 'Hair Removal',
    desc: 'Rica wax for body.',
    items: [
      { n: 'Underarms', p: [400] }, { n: 'Half Arms', p: [600] }, { n: 'Full Arms', p: [900] }, { n: 'Half Legs', p: [800] },
      { n: 'Full Legs', p: [1000] }, { n: 'Back Waxing', p: [1200] }, { n: 'Full Body Waxing', p: [4000] }
    ] },
  { id: 'manipedi', title: 'Manicure / Pedicure', cat: 'nails', tab: 'Mani / Pedi', type: 'Nails',
    desc: 'Hand and foot care, from regular to crystal. Prices shown as Manicure / Pedicure.',
    items: [
      { n: 'Regular Manicure / Pedicure', p: [699, 799], lbl: ['Mani', 'Pedi'] },
      { n: 'Spa Manicure / Pedicure', p: [800, 900], lbl: ['Mani', 'Pedi'] },
      { n: 'Paraffin Manicure / Pedicure', p: [900, 1000], lbl: ['Mani', 'Pedi'] },
      { n: 'Crystal Manicure / Pedicure', p: [1000, 1100], lbl: ['Mani', 'Pedi'] },
      { n: 'Cut & File', p: [100] },
      { n: 'Change of Nail Polish', p: [120] }
    ] },
  { id: 'facials', title: 'Facials / Clean-Up', cat: 'beauty', tab: 'Facials', type: 'Skin & Facial',
    desc: 'Clean-ups and classic facials.',
    items: [
      { n: 'Clean-Up', p: [1800] }, { n: 'D-Tan Clean-Up', p: [2000] }, { n: 'Bleach Clean-Up', p: [2000] },
      { n: 'Fruit Facial', p: [2500] }, { n: 'D-Tan Facial', p: [3000] }, { n: 'Bleach Facial', p: [3000] }
    ] },
  { id: 'advance-facials', title: 'Advance Facials', cat: 'beauty', tab: 'Facials', type: 'Skin & Facial',
    desc: 'Targeted premium facials.',
    items: [
      { n: 'Hydra Treatment Facial', p: [10000] }, { n: 'Diamond Brightening Premium Facial', p: [10000] },
      { n: 'Bamboo Charcoal Facial', p: [5000] }, { n: 'Anti-Aging Facial', p: [5000] },
      { n: 'Skin Tightening Facial', p: [6000] }, { n: 'Shine And Glow Facial', p: [6000] },
      { n: 'Vitamin C Brightening Facial', p: [7000] }, { n: 'Gold Premium Facial', p: [6000] },
      { n: 'Bridal Premium Facial', p: [6000] }, { n: 'Seaweed Treatment Facial', p: [6000] },
      { n: 'Power Brightening Facial', p: [3500] }, { n: 'Whitening Skin Starts Here Premium Facial', p: [6000] }
    ] }
];
export const SIZE_CHART = [['S', 'Shoulder'], ['M', 'Below Shoulder'], ['L', 'Waist'], ['XL', 'Below Waist']];
