// بيانات صفحات تفاصيل التقنيات التأهيلية (مستخرجة من فيجما)
import { type Locale } from "@/i18n/config";

export type Technique = {
  slug: string; title: string; badge: string; image: string;
  about: string[]; targets: string[]; offers: string[];
  offerIcons?: string[];
  helpSection?: { title: string; benefitsHeading: string; benefits: string[]; valueHeading: string; values: string[] };
};

export const TECHNIQUES: Technique[] = [
  {
    "slug": "play-attention",
    "title": "PLAY ATTENTION",
    "badge": "متوفر في المراكز",
    "image": "/figma/techniques/play-attention.jpg",
    "about": [
      "هو نظام متكامل من الخدمات قابل للتخصيص حسب احتياجاتك الخاصة. يستخدم (Play Attention) أحدث التقنيات المتاحة للمساعدة على تطوير الوظائف التنفيذية (الانتباه والتركيز) للوصول إلى إمكانات الفرد الكاملة وتطوير مهاراته على كافة الأصعدة. يجمع (Play Attention) بين تقنية مراقبة الدماغ المستوحاة من وكالة ناسا ومجموعة أدوات ضخمة تتناول جميع ما يلزم بدءًا من التطور المعرفي إلى التنظيم الذاتي لتزويدك بحل كامل وفردي."
    ],
    "targets": [
      "متلازمة داون",
      "اضطراب طيف التوحد",
      "القلق",
      "الزهايمر",
      "صعوبات التعلم",
      "ضعف الذاكرة",
      "ضعف التركيز والانتباه"
    ],
    "offers": [
      "تحسين التركيز",
      "دعم الذاكرة",
      "تطوير الانتباه",
      "تحسين الأداء الأكاديمي"
    ]
  },
  {
    "slug": "cogmed",
    "title": "COGMED",
    "badge": "غير متوفر في المراكز",
    "image": "/figma/techniques/cogmed.jpg",
    "about": [
      "هو برنامج تدريبي قائم على الأدلة لتحسين الانتباه والقدرة على التركيز والتذكر حيث تعتبر من أساسيات النجاح في البيئة التعليمية والعمل والحياة اليومية والعلاقات سواء مع الأسرة أو المدرسة أو العمل. ابتداءً من 4 أسابيع من التدريب المعرفي الرقمي يقوم مدرب محترف بتخصيص البرنامج وإرشادك من خلال التدريبات المعرفية، التي يتم الوصول إليها من على جهاز حاسوب أو جهاز لوحي أو هاتف."
    ],
    "targets": [
      "السكتة الدماغية وإصابات الدماغ",
      "تشتت الانتباه ADD / فرط الحركة وتشتت الانتباه ADHD",
      "الأعراض الجانبية لعلاج السرطان",
      "التأثيرات طويلة الأمد للولادة المبكرة"
    ],
    "offers": [
      "تحسين الذاكرة العاملة",
      "زيادة التركيز",
      "دعم التعلم",
      "تحسين الأداء اليومي"
    ]
  },
  {
    "slug": "kinems",
    "title": "KINEMS",
    "badge": "متوفر في المراكز",
    "image": "/figma/techniques/kinems.jpg",
    "about": [
      "هي تقنية تعليم تكاملية مخصصة بالكامل لاحتياجات ابنك من خلال مجموعة من الألعاب الحركية التعليمية القائمة على منهج متعدد الحواس، تحاكي جميع الأهداف التعليمية لمنهج المدارس من مرحلة رياض الأطفال حتى المرحلة الابتدائية حيث تركز على المهارات الأكاديمية مثل الرياضيات والمهارات اللغوية من قراءة وكتابة وصولًا إلى المهارات الحركية والتي تستهدف أنشطة العلاج الوظيفي والطبيعي وتنمية المهارات الإدراكية والتي تجعل العملية التعليمية أكثر فاعلية وذات تأثير أسرع في تطور ابنك."
    ],
    "targets": [
      "ضعف في المهارات اللغوية",
      "تأخر في المهارات الأكاديمية",
      "ضعف في المهارات الإدراكية",
      "ضعف في المهارات الحركية"
    ],
    "offers": [
      "تنمية المهارات الحركية",
      "دعم التعلم",
      "تحسين الإدراك",
      "تطوير المهارات الأكاديمية"
    ]
  },
  {
    "slug": "photon-robots",
    "title": "Photon Robots",
    "badge": "غير متوفر في المراكز",
    "image": "/figma/techniques/photon-robots.jpg",
    "about": [
      "روبوت Photon هو روبوت تعليمي ذكي مُصمَّم خصيصاً لدعم تطور مهارات الأطفال الاجتماعية والتواصلية والحركية من خلال التفاعل المباشر والممتع. يُساعد الأطفال ذوي اضطراب طيف التوحد على ممارسة التواصل الاجتماعي في بيئة آمنة ومحكومة تُقلّل الضغط النفسي وتُشجع على التعبير والمبادرة، كما يُمكن برمجته بأساليب متنوعة تناسب مختلف المستويات والاحتياجات. لا تتوفر هذه التقنية حالياً في مراكز عبور."
    ],
    "targets": [
      "الاضطرابات العاطفية",
      "اضطراب طيف التوحد (ASD)",
      "صعوبات التواصل والتفاعل الاجتماعي",
      "الاضطرابات الاجتماعية"
    ],
    "offers": [
      "تعزيز التعلم",
      "زيادة التفاعل",
      "تطوير المهارات الاجتماعية",
      "تحسين التواصل"
    ]
  },
  {
    "slug": "floreo",
    "title": "Floreo",
    "badge": "متوفر في المراكز",
    "image": "/figma/techniques/floreo.jpg",
    "about": [
      "منصة Floreo هي نظام علاجي يعتمد على تقنية الواقع الافتراضي (VR) مُصمَّمة خصيصاً لتدعيم المهارات السلوكية والاجتماعية لدى الأفراد ذوي اضطراب طيف التوحد والقلق. تُقدّم بيئات افتراضية آمنة وقابلة للتحكم تُتيح للأفراد تدريب مهاراتهم الاجتماعية بصورة تدريجية ومنظّمة بإشراف المعالج، مما يُعزز التواصل البصري ويُخفّف استجابات القلق في المواقف اليومية."
    ],
    "targets": [
      "الحالات العصبيه",
      "اضطراب طيف التوحد",
      "القلق",
      "ADHD"
    ],
    "offers": [
      "تطوير المهارات الاجتماعية",
      "دعم التواصل",
      "تقليل القلق",
      "تحسين التفاعل اليومي"
    ],
    "offerIcons": [
      "users",
      "chat",
      "heart",
      "star"
    ]
  },
  {
    "slug": "nao-robot",
    "title": "NAO Robot",
    "badge": "متوفر في المراكز",
    "image": "/figma/techniques/nao-robot.jpg",
    "about": [
      "روبوت NAO هو روبوت ذكي متطور مُبرمَج خصيصاً للتفاعل مع الأطفال ومساعدتهم في اكتساب مهارات متنوعة تشمل التواصل الاجتماعي والمهارات الحركية والقدرات المعرفية. يتميز بقدرته على التعبير الانفعالي وتنفيذ الحركات الجسدية المعقدة، مما يجعله أداة تأهيلية فعّالة في التعامل مع الأطفال ذوي اضطراب طيف التوحد. لا يتوفر روبوت NAO حالياً في مراكز عبور."
    ],
    "targets": [
      "صعوبات التواصل الاجتماعي",
      "القلق",
      "اضطراب طيف التوحد",
      "الأطفال الذين يعانون من العزلة الاجتماعية"
    ],
    "offers": [
      "تطوير المهارات الحركية",
      "دعم التطور العاطفي",
      "تنمية التفاعل الاجتماعي",
      "تحسين التواصل"
    ],
    "offerIcons": [
      "activity",
      "heart",
      "users",
      "chat"
    ],
    "helpSection": {
      "title": "كيف يساعد NAO Robot طفلك؟",
      "benefitsHeading": "فوائد التدريب باستخدام روبوت ناو",
      "benefits": [
        "يدعم بشكل كبير التطور العاطفي للأطفال من خلال التفاعل المباشر والتعبير الانفعالي الذي يُتقنه الروبوت.",
        "يساعد في تطوير مهارات التواصل الاجتماعي لدى الأطفال ذوي الاحتياجات الخاصة من خلال تمارين تفاعلية موجّهة.",
        "تطوير القدرات الحركية من خلال الأنشطة الجسدية والتقليد الحركي الذي يُتيحه الروبوت بشكل مبرمج."
      ],
      "valueHeading": "القيمة التربوية التي يضيفها التدريب باستخدام روبوت ناو:",
      "values": [
        "التقليد",
        "المهارات الاجتماعية",
        "الإدراك الجسدي",
        "الاستعداد للتعلم والمهارات الأكاديمية"
      ]
    }
  },
  {
    "slug": "auditory-integration",
    "title": "التكامل السمعي",
    "badge": "متوفر في المراكز",
    "image": "/figma/techniques/auditory-integration.jpg",
    "about": [
      "تقنية التكامل السمعي هي برنامج تدريبي متخصص يهدف إلى إعادة تنظيم الجهاز السمعي وتحسين معالجة الصوت لدى الأفراد الذين يعانون من حساسية سمعية مفرطة أو ضعف في التكامل الحسي. يعتمد البرنامج على الاستماع إلى موسيقى مُعدَّلة إلكترونياً عبر سماعات متخصصة في جلسات منتظمة، مما يُساعد الجهاز السمعي على تطوير قدرته على معالجة الأصوات بشكل متوازن وفعّال.",
      "تُستخدم هذه التقنية في مراكز عبور لدعم الأفراد ذوي اضطراب طيف التوحد والحساسية الحسية المفرطة وصعوبات معالجة اللغة، إذ تُسهم في تقليل الاستجابات السلبية للأصوات وتحسين الانتباه والقدرة على التركيز خلال جلسات التأهيل."
    ],
    "targets": [
      "فرط الحساسية السمعية",
      "اضطراب طيف التوحد (ASD)",
      "صعوبات التواصل والتفاعل الاجتماعي",
      "ضعف التركيز والانتباه"
    ],
    "offers": [
      "تطوير المهارات التعليمية",
      "تحسين المعالجة السمعية",
      "دعم التواصل",
      "تحسين الانتباه"
    ]
  }
];

export const TECHNIQUES_EN: Technique[] = [
  {
    "slug": "play-attention",
    "title": "PLAY ATTENTION",
    "badge": "Available at our centers",
    "image": "/figma/techniques/play-attention.jpg",
    "about": [
      "Play Attention is an integrated system of services that can be customized to your specific needs. It uses the latest available technology to help develop executive functions (attention and focus), unlocking the individual's full potential and developing their skills across all areas. Play Attention combines NASA-inspired brain-monitoring technology with a vast toolkit covering everything from cognitive development to self-regulation, giving you a complete, individualized solution."
    ],
    "targets": [
      "Down Syndrome",
      "Autism Spectrum Disorder",
      "Anxiety",
      "Alzheimer's",
      "Learning Difficulties",
      "Memory impairment",
      "Poor focus and attention"
    ],
    "offers": [
      "Improved focus",
      "Memory support",
      "Attention development",
      "Better academic performance"
    ]
  },
  {
    "slug": "cogmed",
    "title": "COGMED",
    "badge": "Not available at our centers",
    "image": "/figma/techniques/cogmed.jpg",
    "about": [
      "Cogmed is an evidence-based training program for improving attention, focus, and memory — fundamentals of success in education, work, daily life, and relationships, whether with family, school, or work. Over a minimum of 4 weeks of digital cognitive training, a professional coach customizes the program and guides you through the cognitive exercises, accessed from a computer, tablet, or phone."
    ],
    "targets": [
      "Stroke and brain injuries",
      "Attention deficit (ADD) / Attention-deficit/hyperactivity disorder (ADHD)",
      "Side effects of cancer treatment",
      "Long-term effects of premature birth"
    ],
    "offers": [
      "Improved working memory",
      "Increased focus",
      "Learning support",
      "Better daily performance"
    ]
  },
  {
    "slug": "kinems",
    "title": "KINEMS",
    "badge": "Available at our centers",
    "image": "/figma/techniques/kinems.jpg",
    "about": [
      "Kinems is an integrative learning technology fully tailored to your child's needs through a set of educational movement-based games built on a multisensory approach. It mirrors all the learning objectives of the school curriculum from kindergarten through primary school, focusing on academic skills such as mathematics and language skills (reading and writing), as well as motor skills targeting occupational and physical therapy activities and the development of cognitive skills — making the learning process more effective and faster to impact your child's development."
    ],
    "targets": [
      "Weak language skills",
      "Delayed academic skills",
      "Weak cognitive skills",
      "Weak motor skills"
    ],
    "offers": [
      "Motor skills development",
      "Learning support",
      "Improved cognition",
      "Academic skills development"
    ]
  },
  {
    "slug": "photon-robots",
    "title": "Photon Robots",
    "badge": "Not available at our centers",
    "image": "/figma/techniques/photon-robots.jpg",
    "about": [
      "Photon Robot is a smart educational robot specially designed to support the development of children's social, communication, and motor skills through direct, enjoyable interaction. It helps children with Autism Spectrum Disorder practice social communication in a safe, controlled environment that reduces psychological stress and encourages expression and initiative. It can also be programmed in various ways to suit different levels and needs. This technology is not currently available at Oboor Centers."
    ],
    "targets": [
      "Emotional disorders",
      "Autism Spectrum Disorder (ASD)",
      "Communication and social interaction difficulties",
      "Social disorders"
    ],
    "offers": [
      "Enhanced learning",
      "Increased interaction",
      "Social skills development",
      "Improved communication"
    ]
  },
  {
    "slug": "floreo",
    "title": "Floreo",
    "badge": "Available at our centers",
    "image": "/figma/techniques/floreo.jpg",
    "about": [
      "Floreo is a therapeutic platform based on virtual reality (VR) technology, specially designed to strengthen the behavioral and social skills of individuals with Autism Spectrum Disorder and anxiety. It offers safe, controllable virtual environments that allow individuals to practice their social skills gradually and in a structured way under a therapist's supervision, enhancing eye contact and easing anxiety responses in everyday situations."
    ],
    "targets": [
      "Neurological conditions",
      "Autism Spectrum Disorder",
      "Anxiety",
      "ADHD"
    ],
    "offers": [
      "Social skills development",
      "Communication support",
      "Reduced anxiety",
      "Improved daily interaction"
    ],
    "offerIcons": [
      "users",
      "chat",
      "heart",
      "star"
    ]
  },
  {
    "slug": "nao-robot",
    "title": "NAO Robot",
    "badge": "Available at our centers",
    "image": "/figma/techniques/nao-robot.jpg",
    "about": [
      "NAO Robot is an advanced smart robot specially programmed to interact with children and help them acquire a variety of skills, including social communication, motor skills, and cognitive abilities. It stands out for its ability to express emotions and perform complex physical movements, making it an effective rehabilitation tool for working with children with Autism Spectrum Disorder. NAO Robot is not currently available at Oboor Centers."
    ],
    "targets": [
      "Social communication difficulties",
      "Anxiety",
      "Autism Spectrum Disorder",
      "Children experiencing social isolation"
    ],
    "offers": [
      "Motor skills development",
      "Emotional development support",
      "Social interaction development",
      "Improved communication"
    ],
    "offerIcons": [
      "activity",
      "heart",
      "users",
      "chat"
    ],
    "helpSection": {
      "title": "How does the NAO Robot help your child?",
      "benefitsHeading": "Benefits of training with the NAO Robot",
      "benefits": [
        "It strongly supports children's emotional development through the direct interaction and emotional expression the robot masters.",
        "It helps develop social communication skills in children with special needs through guided interactive exercises.",
        "It develops motor abilities through the physical activities and movement imitation the robot enables in a programmed way."
      ],
      "valueHeading": "The educational value that training with the NAO Robot adds:",
      "values": [
        "Imitation",
        "Social skills",
        "Body awareness",
        "Readiness for learning and academic skills"
      ]
    }
  },
  {
    "slug": "auditory-integration",
    "title": "Auditory Integration",
    "badge": "Available at our centers",
    "image": "/figma/techniques/auditory-integration.jpg",
    "about": [
      "Auditory integration technology is a specialized training program aimed at reorganizing the auditory system and improving sound processing in individuals who suffer from auditory hypersensitivity or weak sensory integration. The program relies on listening to electronically modulated music through specialized headphones in regular sessions, helping the auditory system develop its ability to process sounds in a balanced and effective way.",
      "This technology is used at Oboor Centers to support individuals with Autism Spectrum Disorder, sensory hypersensitivity, and language-processing difficulties, as it helps reduce negative responses to sounds and improves attention and the ability to focus during rehabilitation sessions."
    ],
    "targets": [
      "Auditory hypersensitivity",
      "Autism Spectrum Disorder (ASD)",
      "Communication and social interaction difficulties",
      "Poor focus and attention"
    ],
    "offers": [
      "Educational skills development",
      "Improved auditory processing",
      "Communication support",
      "Improved attention"
    ]
  }
];

export const getTechnique = (slug: string, locale: Locale = "ar") =>
  (locale === "en" ? TECHNIQUES_EN : TECHNIQUES).find((t) => t.slug === slug);
