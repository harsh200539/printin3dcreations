import os
import django

# Set settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'print3d_backend.settings')
django.setup()

from api.models import Topic, Product

# Define initial data
topics = [
    {
        "id": 1,
        "title": "Bespoke 3D Design",
        "icon": "PencilRuler",
        "desc": "Transform your raw concepts into physical reality. Our expert designers bring precision and artistry to your custom 3D visions.",
        "details": "From intricate sketches to complex engineering ideas, we provide end-to-end 3D modeling services tailored to your specific requirements."
    },
    {
        "id": 2,
        "title": "Signature Keychains",
        "icon": "Key",
        "desc": "More than just an accessory—a personal statement. Discover our range of precision-printed, articulated, and custom-engraved keychains.",
        "details": "Explore a collection of articulated animals, tactical designs, and personalized monograms crafted with high-strength premium PLA."
    },
    {
        "id": 3,
        "title": "Artisanal Home Decor",
        "icon": "Palette",
        "desc": "Elevate your living space with futuristic geometry and organic art. Hand-finished 3D sculptures that redefine modern home aesthetics.",
        "details": "Curated decor pieces that blend additive manufacturing with sophisticated interior design, perfect for modern homes and office spaces."
    },
    {
        "id": 4,
        "title": "Desk & Tech Gear",
        "icon": "Gamepad2",
        "desc": "Optimize your workspace with high-end stands and tactical accessories designed for the modern enthusiast and professional.",
        "details": "Minimalist headphone stands, modular organizers, and tech accessories that combine functional utility with a premium futuristic look."
    },
    {
        "id": 5,
        "title": "Collector's Models",
        "icon": "GraduationCap",
        "desc": "Detailed scale models and educational kits crafted for collectors and curious minds. Precision in every millimeter.",
        "details": "From high-fidelity F1 replicas to complex biological models, our Precision Series brings detailed craftsmanship to your shelf."
    },
    {
        "id": 6,
        "title": "Cinematic Photo Frames",
        "icon": "Image",
        "desc": "Turn your memories into three-dimensional art. Our frames use light and texture to capture moments like never before.",
        "details": "Specialized frames including Lithophanes and rotating cubes that transform standard photography into an interactive light-based experience."
    }
]

sub_products = {
    2: [
        {
            "id": '2-1', "name": "Signature Monogram", "price": 100,
            "images": ["/images/products/keychains/Alphabet/alphabets.png"],
            "desc": "A bold, standing 3D monogram crafted for those who value individuality.",
            "fullDetails": "Our Signature Monogram is designed to stand out. Literally. Unlike flat keychains, this 3D-standing letter features a stable base and geometric precision.\nCrafted from pro-grade PLA for a premium matte finish.\nPerfect for adding a modern, personal touch to your keys or workspace.",
            "specs": { "material": "Pro-Grade PLA", "finish": "Satin Matte", "weight": "8g" },
            "features": ["Personalized", "Architectural", "Lightweight", "Durable"],
            "customizable": True,
            "customizationLabel": "Enter your character / initials",
            "customizationPlaceholder": "e.g. A, or J.K.",
            "customLettersLimit": 5
        },
        {
            "id": '2-2', "name": "Tactical Ghost", "price": 150,
            "images": ["/images/products/keychains/commando/i1.jpeg", "/images/products/keychains/commando/i2.jpeg", "/images/products/keychains/commando/i3.jpeg", "/images/products/keychains/commando/i4.png"],
            "desc": "Inspired by modern tactical gear, this edgy ghost keychain features high-detail geometric contours.",
            "fullDetails": "The Tactical Ghost combines urban aesthetics with precision manufacturing. Featuring sharp angles and a rugged finish, it's designed for durability.\nEco-friendly PLA construction with high-tensile strength.\nAn ideal collectible for gamers and fans of tactical design.",
            "specs": { "material": "Stealth PLA", "theme": "Tactical Tech", "finish": "Rough Texture" },
            "features": ["Tactical", "High-Detail", "Stealth Build", "Durable"],
            "customizable": True,
            "customizationLabel": "Enter callsign to engrave",
            "customizationPlaceholder": "e.g. GHOST-01",
            "customLettersLimit": 12
        },
        {
            "id": '2-3', "name": "Articulated Lobster", "price": 180,
            "images": ["/images/products/keychains/Articulated Lobster/i1.jpg", "/images/products/keychains/Articulated Lobster/i2.png", "/images/products/keychains/Articulated Lobster/i3.png"],
            "desc": "A marvel of articulated 3D engineering with life-like movement.",
            "fullDetails": "Experience the fluid motion of 3D printing. This articulated lobster is printed in one piece with moving joints.\nRealistic movement for a satisfying tactile experience.",
            "specs": { "material": "Pro PLA", "type": "Articulated", "length": "100mm" },
            "features": ["Fluid Motion", "Tactile", "Single-Print", "Eco-Friendly"],
            "customizable": False
        },
        {
            "id": '2-4', "name": "Prehistoric Dino", "price": 140,
            "images": ["/images/products/keychains/Dino/i1.png", "/images/products/keychains/Dino/i2.png", "/images/products/keychains/Dino/i3.png", "/images/products/keychains/Dino/i4.png"],
            "desc": "A geometric low-poly dinosaur keychain for the ancient explorer.",
            "fullDetails": "Modern low-poly design meets ancient history. A sturdy and stylish companion for your daily adventures.",
            "specs": { "material": "Durable PLA", "style": "Low-Poly", "weight": "12g" },
            "features": ["Geometric", "Strong", "Playful", "Modern"],
            "customizable": False
        },
        {
            "id": '2-5', "name": "Flexi Octopus", "price": 120,
            "images": ["/images/products/keychains/Flexi Octopus/i1.jpg", "/images/products/keychains/Flexi Octopus/i2.jpg"],
            "desc": "The ultimate fidget companion. Every tentacle moves independently with satisfying precision.",
            "fullDetails": "Our Flexi Octopus is a fan favorite. Each leg is independently articulated, providing a unique tactile experience that is perfect for focus and stress relief.",
            "specs": { "material": "Premium PLA", "joints": "100% Articulated", "size": "Mini" },
            "features": ["Fidget Friendly", "Articulated", "Single-Piece", "Unique"],
            "customizable": False
        },
        {
            "id": '2-6', "name": "Iron Gym Plate", "price": 90,
            "images": ["/images/products/keychains/Gym plate/i1.png", "/images/products/keychains/Gym plate/i2.png"],
            "desc": "A miniature gym plate for the fitness enthusiast. Lightweight but heavy on style.",
            "fullDetails": "Keep your gains close with this detailed gym plate replica. Features realistic lettering and textured grip area.",
            "specs": { "material": "High-Density PLA", "theme": "Fitness", "finish": "Textured" },
            "features": ["Fitness Inspired", "Detailed", "Lightweight", "Durable"],
            "customizable": True,
            "customizationLabel": "Enter Weight or Initials",
            "customizationPlaceholder": "e.g. 45LB or AT",
            "customLettersLimit": 6
        },
        {
            "id": '2-7', "name": "Ocean Motion Shark", "price": 150,
            "images": ["/images/products/keychains/Shark/i1.jpg", "/images/products/keychains/Shark/i2.jpg", "/images/products/keychains/Shark/i3.jpg", "/images/products/keychains/Shark/i4.jpg"],
            "desc": "A marvel of articulated 3D engineering with realistic fluid motion.",
            "fullDetails": "Experience the fluid motion of the ocean in the palm of your hand. This articulated shark is printed in one piece with moving joints.\nHand-finished to ensure smooth, snag-free movement.",
            "specs": { "material": "Flexible PLA", "length": "90mm", "joints": "Articulated" },
            "features": ["Fluid Motion", "Tactile Fidget", "Bio-mimicry", "Single-Print"],
            "customizable": True,
            "customizationLabel": "Enter name for shark tag",
            "customizationPlaceholder": "e.g. BRUCE",
            "customLettersLimit": 10
        },
        {
            "id": '2-8', "name": "Midnight Skeleton", "price": 160,
            "images": ["/images/products/keychains/Skeleton/i1.jpg", "/images/products/keychains/Skeleton/i2.jpg", "/images/products/keychains/Skeleton/i3.jpg"],
            "desc": "A fully articulated miniature skeleton with incredible bone-structure detail.",
            "fullDetails": "Perfect for the edgy collector. This skeleton features moving limbs and a detailed skull, all crafted with Exacting craftsmanship.",
            "specs": { "material": "Bone-White PLA", "joints": "Multi-point", "style": "Anatomical" },
            "features": ["Fully Posable", "Detailed", "Articulated", "Collectors Item"],
            "customizable": False
        },
        {
            "id": '2-9', "name": "Knitted Studio Cat", "price": 130,
            "images": ["/images/products/keychains/Knitted Cat/i1.jpeg", "/images/products/keychains/Knitted Cat/i2.png", "/images/products/keychains/Knitted Cat/i3.jpeg", "/images/products/keychains/Knitted Cat/i4.png"],
            "desc": "A charming 'knitted-texture' 3D cat that captures the warmth of wool in durable resin.",
            "fullDetails": "Unique texture that mimics a hand-knitted plushie. A perfect gift for pet lovers who appreciate modern technology.",
            "specs": { "material": "Soft-Texture PLA", "style": "Knitted Effect", "finish": "Matte" },
            "features": ["Cozy Aesthetic", "Unique Texture", "Pet Inspired", "Giftable"],
            "customizable": False
        },
        {
            "id": '2-10', "name": "Knitted Studio Dog", "price": 130,
            "images": ["/images/products/keychains/Knitted Dog/i1.jpeg", "/images/products/keychains/Knitted Dog/i2.jpeg", "/images/products/keychains/Knitted Dog/i3.png"],
            "desc": "The canine companion in our Signature Knitted Series. Warm texture meets 3D precision.",
            "fullDetails": "Part of our best-selling knitted series, this dog features a complex surface pattern that feels as good as it looks.",
            "specs": { "material": "Soft-Texture PLA", "style": "Knitted Effect", "finish": "Matte" },
            "features": ["Cozy Aesthetic", "Unique Texture", "Pet Inspired", "Giftable"],
            "customizable": False
        },
        {
            "id": '2-11', "name": "Next-Gen Console Mini", "price": 145,
            "images": ["/images/products/keychains/PS5/i1.JPEG"],
            "desc": "The future of gaming, miniaturized. A sleek, high-fidelity replica.",
            "fullDetails": "Designed for the ultimate gamer. This mini console replica captures the iconic curves and futuristic aesthetic of next-gen gaming.",
            "specs": { "material": "Satin White PLA", "style": "Minimalist Tech", "finish": "Premium Smooth" },
            "features": ["Gamer Luxe", "High-Fidelity", "Sleek Geometry", "Lightweight"],
            "customizable": True,
            "customizationLabel": "Enter GamerTag for engraving",
            "customizationPlaceholder": "e.g. VOLTAGE_99",
            "customLettersLimit": 15
        },
        {
            "id": '2-12', "name": "Knitted Studio Rabbit", "price": 130,
            "images": ["/images/products/keychains/knittted rabbit/i1.jpeg", "/images/products/keychains/knittted rabbit/i2.jpeg", "/images/products/keychains/knittted rabbit/i3.jpeg", "/images/products/keychains/knittted rabbit/i4.png"],
            "desc": "The softest-looking 3D print in the collection. A knitted-texture rabbit with organic charm.",
            "fullDetails": "Complete your Knitted Series set with this adorable rabbit. Features delicate ear details and a cozy wool-like surface.",
            "specs": { "material": "Soft-Texture PLA", "style": "Knitted Effect", "finish": "Matte" },
            "features": ["Cozy Aesthetic", "Unique Texture", "Giftable", "Durable"],
            "customizable": False
        },
        {
            "id": '2-13', "name": "Champion Shuttlecock", "price": 110,
            "images": ["/images/products/keychains/shuttlecock/i1.png"],
            "desc": "A tribute to the game. Precise feather-geometry rendered in a lightweight 3D form.",
            "fullDetails": "For the badminton enthusiasts. This shuttlecock replica captures the aerodynamic structure with surprising detail.",
            "specs": { "material": "Lightweight PLA", "theme": "Sports", "finish": "Clean White" },
            "features": ["Sports Tribute", "Feather Detail", "Lightweight", "Durable"],
            "customizable": False
        },
        {
            "id": '2-14', "name": "Master Pokeball", "price": 160,
            "images": ["/images/products/keychains/pokeball/i1.jpeg", "/images/products/keychains/pokeball/i2.jpeg", "/images/products/keychains/pokeball/i3.jpeg", "/images/products/keychains/pokeball/i4.png"],
            "desc": "A collector's sphere for the ultimate trainer. High-contrast multi-color design.",
            "fullDetails": "Start your journey with this detailed Pokeball replica. Features a functioning-look button and precise split-shell geometry.",
            "specs": { "material": "High-Impact PLA", "theme": "Anime", "finish": "Glossy Touch" },
            "features": ["Collector Series", "Iconic Design", "Vibrant Colors", "Sturdy Build"],
            "customizable": True,
            "customizationLabel": "Enter Trainer Name",
            "customizationPlaceholder": "e.g. ASH",
            "customLettersLimit": 10
        },
        {
            "id": '2-15', "name": "Tactical Repper", "price": 140,
            "images": ["/images/products/keychains/repper/i1.png", "/images/products/keychains/repper/i2.png", "/images/products/keychains/repper/i3.png", "/images/products/keychains/repper/i4.png"],
            "desc": "Aggressive geometric styling for the modern tech setup. A bold architectural statement.",
            "fullDetails": "The Repper features complex internal geometry and sharp facets that highlight the capabilities of high-end 3D printing.",
            "specs": { "material": "Architectural PLA", "style": "Geometric", "finish": "Angular" },
            "features": ["Bold Design", "Tech Aesthetic", "Strong", "Unique"],
            "customizable": False
        }
    ],
    3: [
        {
            "id": '3-1', "name": "Serenity Deskplate", "price": 299,
            "images": ["/images/products/Home and Decor/Home Sweet Home/i1.png", "/images/products/Home and Decor/Home Sweet Home/i2.png", "/images/products/Home and Decor/Home Sweet Home/i3.png"],
            "desc": "A sophisticated layering of light and shadow. Artisanal deskplate.",
            "fullDetails": "The Serenity Deskplate is an exercise in modern typography. Using a multi-layered 3D printing technique, we create a depth-effect that traditional signs can't match.",
            "specs": { "material": "Soft-Touch PLA", "dimensions": "130mm x 75mm", "style": "Modern Scandi" },
            "features": ["Depth-Effect", "Artisanal", "Lightweight", "Premium Gift"]
        },
        {
            "id": '3-2', "name": "F1 Grand Prix Tracker", "price": 599,
            "images": ["/images/products/Home and Decor/F1 Calender/i1.PNG", "/images/products/Home and Decor/F1 Calender/i2.PNG", "/images/products/Home and Decor/F1 Calender/i3.PNG", "/images/products/Home and Decor/F1 Calender/i4.PNG", "/images/products/Home and Decor/F1 Calender/i5.PNG"],
            "desc": "The ultimate track-side companion. Precision-printed F1 circuit display.",
            "fullDetails": "Fuel your passion for the pinnacle of motorsport. This Grand Prix Tracker features highly detailed track layouts from the current F1 calendar.",
            "specs": { "material": "Silk Metallic PLA", "trackCount": "Full Season", "display": "Self-Standing" },
            "features": ["Circuit Detail", "Motorsport Luxe", "Silk Finish", "Collectible"]
        },
        {
            "id": '3-3', "name": "Precision Honeycomb Stand", "price": 349,
            "images": ["/images/products/Home and Decor/Honeycomb Stand/i1.PNG", "/images/products/Home and Decor/Honeycomb Stand/i2.PNG", "/images/products/Home and Decor/Honeycomb Stand/i3.PNG"],
            "desc": "A modular, hexagonal organizer inspired by nature's perfect architecture.",
            "fullDetails": "The Honeycomb Stand combines organic geometry with industrial strength. Perfect for organizing your desk essentials or displaying your favorite items.",
            "specs": { "material": "Hex-Grid PLA", "style": "Parametric", "finish": "Satin" },
            "features": ["Modular", "High Strength", "Organic Design", "Functional Art"],
            "customizable": False
        },
        {
            "id": '3-4', "name": "Aero-F1 Deskplate", "price": 399,
            "images": ["/images/products/Home and Decor/F1 Deskplate/i1.PNG", "/images/products/Home and Decor/F1 Deskplate/i2.PNG"],
            "desc": "A horizontal desk display celebrating the speed and aerodynamic lines of F1.",
            "fullDetails": "Minimalist desk typography featuring iconic F1 branding and aerodynamic accents. A must-have for every racing fan's setup.",
            "specs": { "material": "Silk PLA", "style": "Horizontal Display", "theme": "Racing" },
            "features": ["Racing Luxe", "Metallic Finish", "Sleek", "Sturdy"],
            "customizable": True,
            "customizationLabel": "Enter Favorite Driver No.",
            "customizationPlaceholder": "e.g. 44 or 33",
            "customLettersLimit": 3
        },
        {
            "id": '3-5', "name": "Personalized Name Stand", "price": 449,
            "images": ["/images/products/Home and Decor/Name Letter Stand/i1.jpeg", "/images/products/Home and Decor/Name Letter Stand/i2.png", "/images/products/Home and Decor/Name Letter Stand/i3.png", "/images/products/Home and Decor/Name Letter Stand/i4.png"],
            "desc": "A custom-made 3D name plate that adds a personal signature to your office or room.",
            "fullDetails": "Our Name Letter Stand features a modern serif font and a stable integrated base. Each piece is custom-modeled to ensure perfect balance and letter spacing.",
            "specs": { "material": "Premium PLA", "style": "Modern Serif", "finish": "Matte" },
            "features": ["Fully Custom", "Office Luxe", "Stable Base", "Ideal Gift"],
            "customizable": True,
            "customizationLabel": "Enter Name (up to 10 letters)",
            "customizationPlaceholder": "e.g. NIRAJ",
            "customLettersLimit": 10
        },
        {
            "id": '3-6', "name": "Car-Garage Keyholder", "price": 499,
            "images": ["/images/products/Home and Decor/Car-Garage keyholder/i1.PNG", "/images/products/Home and Decor/Car-Garage keyholder/i2.PNG", "/images/products/Home and Decor/Car-Garage keyholder/i3.PNG"],
            "desc": "A functional wall-mounted key holder designed with a modern garage aesthetic.",
            "fullDetails": "Never lose your keys again. This architectural keyholder features multiple slots and a sleek, minimalist mounting system.",
            "specs": { "material": "High-Tensile PLA", "type": "Wall-Mount", "finish": "Rugged" },
            "features": ["Functional", "Architectural", "Wall Mounted", "Strong"],
            "customizable": False
        }
    ],
    4: [
        {
            "id": '4-1', "name": "Apex Headphone Studio", "price": 350,
            "images": ["/images/products/Stands and Accessories/Minimalist headphone stand/i1.jpg", "/images/products/Stands and Accessories/Minimalist headphone stand/i2.jpg", "/images/products/Stands and Accessories/Minimalist headphone stand/i3.jpg", "/images/products/Stands and Accessories/Minimalist headphone stand/i4.png"],
            "desc": "Protect your gear with architectural elegance. Minimalist stand.",
            "fullDetails": "Your headphones deserve more than a desk. The Apex Studio stand is engineered with a wide arc to prevent headband indentation.",
            "specs": { "material": "High-Strength PLA", "style": "Minimalist", "base": "Weighted Stability" },
            "features": ["Gear Preservation", "Sleek Geometry", "Sturdy Build", "Desk Optimization"]
        }
    ],
    5: [
        {
            "id": '5-1', "name": "Aero-Formula Series: 01", "price": 180,
            "images": ["/images/products/Home and Decor/F1 car model/i1.jpg", "/images/products/Home and Decor/F1 car model/i2.png", "/images/products/Home and Decor/F1 car model/i3.png", "/images/products/Home and Decor/F1 car model/i4.png"],
            "desc": "A masterclass in aerodynamic modeling. Scale F1 replica.",
            "fullDetails": "The Aero-Formula Series brings the engineering brilliance of Formula 1 to your shelf. Every winglet and diffuser is rendered with high-precision 3D printing.",
            "specs": { "material": "Precision PLA", "scale": "1:24", "length": "180mm" },
            "features": ["Aero Detail", "High-Precision", "Scale Accuracy", "Professional Finish"]
        }
    ],
    6: [
        {
            "id": '6-1', "name": "Lumina Lithophane Box", "price": 999,
            "images": ["/images/products/Home and Decor/Home Sweet Home/i1.png"],
            "desc": "The magic of light and texture. Cinematic light-box.",
            "fullDetails": "Discover Lithophany—an ancient art form reinvented for the 21st century. Your photo is converted into a 3D texture that only reveals its detail when backlit.",
            "specs": { "material": "Translucent Ivory PLA", "illumination": "Warm LED", "power": "USB Powered" },
            "features": ["Hidden Art", "Cinematic Glow", "Personalized Legacy", "Unique Gift"]
        }
    ]
}

# Run seed
print("Seeding database...")
created_topics = {}

for topic_data in topics:
    # Delete if exists to make it re-runnable
    Topic.objects.filter(id=topic_data["id"]).delete()
    
    topic = Topic.objects.create(
        id=topic_data["id"],
        title=topic_data["title"],
        icon=topic_data["icon"],
        desc=topic_data["desc"],
        details=topic_data["details"],
        image=topic_data.get("image", None),
        is_active=topic_data.get("isActive", topic_data.get("is_active", True))
    )
    created_topics[topic.id] = topic
    print(f"Created Topic: {topic.title}")

for topic_id, products in sub_products.items():
    topic = created_topics.get(topic_id)
    if not topic:
        continue
    
    for prod in products:
        Product.objects.filter(product_id=prod["id"]).delete()
        
        Product.objects.create(
            product_id=prod["id"],
            topic=topic,
            name=prod["name"],
            price=prod["price"],
            images=prod["images"],
            desc=prod["desc"],
            full_details=prod.get("fullDetails", ""),
            specs=prod.get("specs", {}),
            features=prod.get("features", []),
            has_colors=prod.get("hasColors", False),
            color_options=prod.get("colorOptions", []),
            customizable=prod.get("customizable", False),
            customization_label=prod.get("customizationLabel", ""),
            customization_placeholder=prod.get("customizationPlaceholder", ""),
            custom_letters_limit=prod.get("customLettersLimit", 50),
            is_bestseller=prod.get("isBestseller", False),
            is_active=prod.get("isActive", prod.get("is_active", True))
        )
        print(f"Created Product: {prod['name']} under {topic.title}")

print("Seeding finished successfully!")
