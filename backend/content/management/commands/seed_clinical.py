# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
from content.m_clinical import ClinicalService


def age_programs(adult_sub):
    return {
        "kind": "agePrograms",
        "heading": "البرامج المقدمة",
        "adult": {"title": "برنامج للكبار", "sub": adult_sub, "label": "برنامج متكامل للكبار"},
        "child": {"title": "برنامج للأطفال (أقل من 12 سنة)", "label": "مقسم إلى 4 مستويات", "levels": ["المستوى الأول", "المستوى الثاني", "المستوى الثالث", "المستوى الرابع"]},
    }


def age_programs_en(adult_sub):
    return {
        "kind": "agePrograms",
        "heading": "Programs Offered",
        "adult": {"title": "Adult Program", "sub": adult_sub, "label": "Comprehensive program for adults"},
        "child": {"title": "Children's Program (under 12 years)", "label": "Divided into 4 levels", "levels": ["Level One", "Level Two", "Level Three", "Level Four"]},
    }


SERVICES_AR = [
    {
        "slug": "physical",
        "title": "خدمة العلاج الطبيعي",
        "subtitle": "تقديم أفضل الاستراتيجيات العلاجية للأفراد الذين يعانون من اضطرابات وصعوبات حركية لتحسين قدرتهم على أداء وظائفهم اليومية.",
        "image": "/figma/services/physical.jpg",
        "aboutHeading": "عن العلاج الطبيعي",
        "about": ["تسعى مراكز عبور لتقديم أفضل الاستراتيجيات العلاجية في مجال العلاج الطبيعي للأفراد الذين يعانون من اضطرابات وصعوبات حركية تؤثر على حركة الفرد خلال أداء وظائفه اليومية، وذلك باستخدام أسلوب شامل للوقاية والتشخيص ومعالجة المشكلات والاضطرابات الحركية والحالات المرضية باستخدام مختلف التمارين العلاجية والوسائل الفيزيائية."],
        "blocks": [
            age_programs("(12 سنة وأكثر)"),
            {"kind": "pills", "heading": "الفئات المستهدفة", "dark": True, "items": ["الاضطرابات النمائية المختلفة", "اضطراب طيف التوحد", "متلازمة داون", "الشلل الدماغي", "الإعاقات الحركية", "إصابات العمود الفقري", "إصابات الرأس", "اضطرابات المشي", "المشاكل العضلية", "تأهيل الإصابات والكسور", "التأهيل قبل وبعد العمليات الجراحية"]},
            {"kind": "areas", "heading": "مجالات التدريب", "intro": "يغطي برنامج العلاج الطبيعي تسعة مجالات تدريبية متكاملة تشمل جميع جوانب الأداء الحركي لدى الفرد.", "items": [
                {"title": "القوة العضلية", "desc": "تعزيز قدرة العضلات على توليد القوة وأداء الحركات بكفاءة وفاعلية"},
                {"title": "الشد العضلي", "desc": "تحسين مرونة العضلات وتقليل التوتر العضلي الزائد لراحة أفضل"},
                {"title": "المدى الحركي", "desc": "توسيع نطاق حركة المفاصل وتحسين مرونتها الطبيعية والوظيفية"},
                {"title": "المهارات الحركية الدقيقة", "desc": "تطوير دقة وتناسق حركات اليدين والأصابع في المهام اليومية"},
                {"title": "المهارات الحركية الكبرى", "desc": "تحسين حركات الجسم الكبرى كالمشي والجري والقفز والتنقل"},
                {"title": "قدرة التحمل", "desc": "بناء قدرة الجسم على الاستمرار في الأداء الحركي لفترات أطول"},
                {"title": "مهارات التناسق الحركي", "desc": "تنسيق حركات الجسم المختلفة بشكل متناغم ومتزامن وسلس"},
                {"title": "مهارات التوازن", "desc": "تعزيز القدرة على الحفاظ على ثبات الجسم أثناء الحركة والسكون"},
                {"title": "المنعكسات الحركية", "desc": "تطوير استجابة الجسم الحركية التلقائية السريعة والسليمة"},
            ]},
        ],
    },
    {
        "slug": "occupational",
        "title": "خدمة العلاج الوظيفي",
        "subtitle": "برنامج تأهيلي متخصص يهدف إلى تنمية مهارات الاستقلال والقدرة على أداء الأنشطة اليومية من خلال خطط علاجية فردية تعتمد على أحدث أساليب العلاج الوظيفي.",
        "image": "/figma/services/occupational.jpg",
        "aboutHeading": "عن العلاج الوظيفي",
        "about": ["تسعى مراكز عبور لتقديم أفضل الاستراتيجيات العلاجية في مجال العلاج الوظيفي للأفراد الذين يعانون من اضطرابات حسية وصعوبات حركية وإدراكية واجتماعية تؤثر على الأداء الاستقلالي في الحياة اليومية، تهدف خدمة العلاج الوظيفي إلى أن يكون الشخص مستقلاً في وظائف الحياة اليومية التي يعيشها ويكون التدخل وفق استراتيجيات أثبتت نجاحها دولياً."],
        "blocks": [
            age_programs("( 12 سنة وأكثر )"),
            {"kind": "pills", "heading": "الفئات المستهدفة", "dark": True, "items": ["الشلل الدماغي", "الاضطرابات الحسية", "اضطراب طيف التوحد", "فرط الحركة وتشتت الانتباه", "إصابات الرأس", "اضطرابات المشي", "المشاكل العضلية", "متلازمة داون", "الاضطرابات النمائية المختلفة", "التأهيل قبل وبعد العمليات الجراحية", "الاضطرابات السمعية", "صعوبات التعلم", "الإعاقات الذهنية", "الإعاقات الحركية"]},
            {"kind": "areas", "heading": "مجالات التدريب", "intro": "تشمل خدمة العلاج الوظيفي عشرة مجالات تدريبية متكاملة تغطي جوانب الأداء الحسي والحركي والإدراكي والاجتماعي.", "items": [
                {"title": "التكامل الحسي", "desc": "تنظيم وتكامل المعلومات الحسية الواردة من البيئة لتحسين الاستجابة السلوكية الملائمة"},
                {"title": "مهارات الحياة اليومية", "desc": "تدريب الفرد على أداء أنشطة الحياة اليومية باستقلالية ومرونة وثقة"},
                {"title": "المهارات الإدراكية", "desc": "تطوير القدرات الذهنية والإدراكية كالانتباه والذاكرة وحل المشكلات"},
                {"title": "المهارات الحركية الدقيقة", "desc": "تحسين دقة وتناسق حركات الأصابع واليدين لأداء المهام الدقيقة"},
                {"title": "المهارات الحركية الكبرى", "desc": "تقوية وتنسيق حركات الجسم الكبيرة كالمشي والجري والتوازن والتنقل"},
                {"title": "مهارات التناسق الحركي", "desc": "تعزيز تناسق وانسيابية حركات الجسم في تسلسل وتزامن متوازن"},
                {"title": "مهارات التناسق الحركي البصري", "desc": "ربط المعلومات البصرية بالاستجابة الحركية الدقيقة لتحسين الأداء اليدوي"},
                {"title": "مهارات الإدراك البصري", "desc": "تطوير قدرة الدماغ على تفسير المعلومات البصرية وتمييزها ومعالجتها"},
                {"title": "مهارات قبل الكتابة", "desc": "بناء الأسس الحركية والإدراكية اللازمة لتعلم الكتابة بشكل صحيح وسليم"},
                {"title": "المهارات الاجتماعية", "desc": "تنمية قدرات التواصل والتفاعل الاجتماعي الإيجابي مع الأقران والبيئة المحيطة"},
            ]},
        ],
    },
    {
        "slug": "psychological",
        "title": "الخدمات النفسية",
        "subtitle": "تسعى مراكز عبور إلى تقديم الخدمات النفسية بمستوى ودقة مهنية عالية تساهم في تحسين جودة حياة الأفراد ذوي الإعاقة وتطبيق أحدث البرامج العلاجية التي تساهم في تحسين قدرات الفرد الشخصية والاجتماعية والمهنية.",
        "image": "/figma/services/psychological.jpg",
        "aboutHeading": "عن الخدمات النفسية",
        "about": ["تقدّم مراكز عبور خدمات نفسية متخصصة تعتمد على أحدث الأساليب العلمية والتطبيقات العلاجية بهدف دعم الأفراد ذوي الإعاقة وأسرهم، من خلال التقييم النفسي، التدخلات العلاجية، والإرشاد الأسري، بما يسهم في تحسين جودة الحياة وتعزيز التكيف النفسي والاجتماعي."],
        "blocks": [
            {"kind": "cards", "heading": "الخدمات النفسية المقدمة", "dark": True, "cols": 2, "items": [
                {"title": "العلاج السلوكي", "desc": "من خلال تصميم وصياغة الخطط العلاجية وفق ما يتناسب مع كل حالة استنادًا على مبادئ تحليل السلوك التطبيقي في فهم وتحسين السلوكيات بهدف:", "bullets": [
                    "المساهمة في زيادة السلوكيات المقبولة اجتماعيًا والتي تسعى الأسرة إلى تحقيقها.",
                    "المساعدة في تقليل السلوكيات غير المقبولة اجتماعيًا وتعلّم أساليب التواصل الفعالة مع الآخرين.",
                    "مساعدة الحالات في التخلص من مشكلات الخوف والقلق باستخدام أساليب علاجية مستندة على الأدلة والبراهين العلمية.",
                    "علاج المشكلات الأكاديمية والاجتماعية المرتبطة بالاضطرابات النمائية.",
                ]},
                {"title": "التقييم النفسي", "desc": "تقديم الخدمات التشخيصية في مجال الاضطرابات النمائية، وتشمل تقييم الوظائف الذهنية والانفعالية للفرد وتحديد جوانب الضعف والقوة لديه، مع تقديم توصيات مهنية مستندة إلى نتائج التقييم لتوجيه الحالة للبرامج المناسبة."},
            ]},
            {"kind": "prose", "heading": "البرامج الإرشادية المقدمة للأسر", "paragraphs": ["تقديم البرامج الإرشادية والتي تساهم في تقديم الدعم النفسي للأسر وتطبيق التدخلات السلوكية وتعميمها في البيئات الطبيعية، وجعل الأسرة شريكًا أساسيًا في اكتساب الفرد مهارات الحياة اليومية."]},
            {"kind": "pills", "heading": "الفئات المستهدفة", "intro": "تقديم البرامج الإرشادية والتي تساهم في تقديم الدعم النفسي للأسر وتطبيق التدخلات السلوكية وتعميمها في البيئات الطبيعية، وجعل الأسرة شريكًا أساسيًا في اكتساب الفرد مهارات الحياة اليومية.", "items": ["متلازمة داون", "الإعاقة الذهنية", "اضطراب طيف التوحد", "فرط الحركة وتشتت الانتباه ADHD", "جميع حالات الاضطرابات النمائية", "الاضطرابات السلوكية", "الاضطرابات النفسية", "صعوبات التعلم"]},
        ],
    },
    {
        "slug": "social",
        "title": "الخدمات الاجتماعية",
        "subtitle": "خدمات اجتماعية تهدف إلى تطوير سبل الرعاية المقدمة لذوي الإعاقة وأسرهم وفق أعلى معايير الجودة.",
        "image": "/figma/services/social.jpg",
        "aboutHeading": "عن الخدمات الاجتماعية",
        "about": [
            "تسعى مراكز عبور إلى تقديم الخدمات الاجتماعية وتطوير سبل الرعاية المقدمة لذوي الإعاقة وأسرهم وفق أعلى معايير الجودة.",
            "وذلك من خلال مجموعة من الجهود التي تركز على دعم الأسرة، وتعزيز الدمج المجتمعي، وتفعيل الشراكات الداعمة.",
        ],
        "blocks": [
            {"kind": "tiles", "heading": "أهداف الخدمة", "dark": True, "cols": 4, "items": ["المساعدة في دمج ذوي الإعاقة وأسرهم بشكل فعال في المجتمع.", "المساهمة في حصول ذوي الإعاقة على خدمات التدخل المبكر.", "مساعدة الأسر في تخطي الصعوبات وتمكينها من المساهمة بشكل فعال في تطوير قدرات أبنائهم.", "تقديم برامج التدخل المهني مع أسر ذوي الإعاقة.", "تفعيل الشراكات المجتمعية والتي تساهم في تحسين جودة حياة ذوي الإعاقة وأسرهم.", "إيجاد قنوات تواصل بين الجهات الرسمية والداعمة وأسر ذوي الإعاقة للمساهمة في تمكين الأسرة من الاستفادة من الخدمات المقدمة."]},
            {"kind": "tiles", "heading": "أهمية الخدمات الاجتماعية", "filled": True, "cols": 4, "items": ["بناء روابط فعالة مع الجهات الداعمة", "تحسين الوصول إلى الخدمات المناسبة", "دعم الدمج المجتمعي لذوي الإعاقة", "تمكين الأسر من أداء دورها بشكل أفضل"]},
        ],
    },
    {
        "slug": "speech",
        "title": "خدمة النطق والتخاطب",
        "subtitle": "خدمة متخصصة تهدف إلى تشخيص وعلاج اضطرابات النطق والتخاطب من خلال برامج فردية تعتمد على تقييم دقيق لقدرات كل فرد، بهدف تحسين مهارات التواصل وتعزيز القدرة على التفاعل بشكل فعال في الحياة اليومية.",
        "image": "/figma/services/speech.jpg",
        "aboutHeading": "عن النطق والتخاطب",
        "about": ["تهتم مراكز عبور بتقديم الرعاية الكاملة للأفراد الذين يعانون من اضطرابات في النطق والتخاطب، حيث يتم التدخل من بداية اكتشاف المشكلة وفي أي مرحلة عمرية من خلال تقييم قدرات الفرد والتعرف على نقاط القوة والضعف لديه، ثم وضع خطة علاجية تناسب تشخيصه وقدراته."],
        "aboutList": ["التقييم من قبل أخصائي النطق والتخاطب لتحديد الخطة العلاجية المناسبة له.", "العلاج والتأهيل من خلال جلسات تدريبية فردية يتم تحديدها حسب الحالة.", "التدريب على الخطة التي تم وضعها من خلال الأدوات والوسائل التدريبية المناسبة للفرد."],
        "blocks": [
            {"kind": "cards", "heading": "برامج خدمة النطق والتخاطب", "intro": "في مراكز عبور تم تصميم برامج تناسب الأفراد من ذوي الإعاقة وتم تقسيمها إلى 4 مستويات وبرامج مختلفة حسب حالة الفرد.", "dark": True, "cols": 2, "items": [
                {"title": "المستوى الأول", "desc": "وهو يهتم بتأهيل الفرد في مراحل التدريب الأولى حيث تهتم بمجالات (الطلب – التقليد – اللغة الاستقبالية – الإدراك والمطابقة – التواصل البصري)."},
                {"title": "المستوى الثاني", "desc": "حيث يهتم بتطوير مهارات اللغة والكلام لدى الفرد ويهتم بمجالات (الطلب بجمل – الحوار – التسمية – التقليد – تنفيذ الأوامر المركبة) وغيرها من المجالات التي تساعد على تطوير اللغة والحوار لديه."},
                {"title": "المستوى الثالث", "desc": "حيث يؤهل الفرد إلى التواصل بشكل فعال مع المجتمع الخارجي ودمجه من خلال زيادة قدرته على الحوار والقراءة وفهم الحوار والمشاركة في المواضيع المختلفة."},
                {"title": "المستوى الرابع", "desc": "برنامج التأهيل السمعي هو برنامج خاص بالأفراد ذوي الضعف السمعي وزراعة القوقعة، حيث يهتم بالتدريب على الأصوات والاعتماد على حاسة السمع في استقبال اللغة وليس قراءة الشفاه."},
            ]},
            {"kind": "pills", "heading": "الفئات المستهدفة", "intro": "الأفراد الذين يعانون من اضطرابات في اللغة أو الصوت أو الكلام لمختلف المراحل العمرية، كما تقدم الخدمة من خلال فريق متخصص وبرامج متخصصة لكل الحالات.", "items": ["زارعي القوقعة", "المتلازمات المختلفة", "الإعاقة الذهنية", "اضطراب طيف التوحد", "اضطرابات الصوت", "صعوبات التعلم", "الشلل الدماغي", "الإعاقة السمعية بدرجاتها المختلفة", "اضطرابات اللغة (الاستقبالية – التعبيرية – التكاملية)", "اضطرابات النطق (تأخر الكلام – اللجلجة – اللدغات – الحبسة الكلامية)"]},
        ],
    },
    {
        "slug": "nursing",
        "title": "خدمة التمريض",
        "subtitle": "خدمة متخصصة تهدف إلى تقديم رعاية صحية متكاملة داخل المركز، من خلال متابعة الحالة الطبية بشكل مستمر والتدخل عند الحاجة، مع توثيق الإجراءات الطبية وتقديم التوعية الصحية اللازمة للأفراد وأسرهم لضمان استقرار الحالة وتحسين جودة الحياة.",
        "image": "/figma/services/nursing.jpg",
        "aboutHeading": "عن خدمة التمريض",
        "about": ["نسعى في مراكز عبور لتقديم الرعاية الطبية الكاملة للأفراد الذين يتلقون التأهيل داخل المركز والوقوف على التاريخ الصحي والتطور ومتابعة استقرار الوضع الصحي والتدخل عند الحاجة مع توثيق جميع الإجراءات الطبية التي تمت في ملف طبي خاص بكل فرد والتواصل مع الطبيب المتابع للحالة بعد التنسيق مع الأسرة بما يلزم، كما يبرز دور خدمة التمريض في القيام بالتوعية والتثقيف الصحي اللازم للأسر."],
        "aboutTag": {"heading": "الفئات المستهدفة", "label": "الأفراد من ذوي الإعاقة"},
        "blocks": [
            {"kind": "checklist", "heading": "مجالات تقديم الرعاية الصحية", "dark": True, "items": ["قياس العلامات الحيوية اليومي (درجة الحرارة – الضغط – النبض).", "متابعة الأفراد الذين يعانون من أمراض مزمنة وتقديم الرعاية اللازمة لهم بشكل يومي.", "متابعة مواعيد جرعات الأدوية الخاصة بالأفراد وتقديمها لهم بالموعد المحدد.", "متابعة الحالات الطارئة اليومية والقيام بالإجراء المناسب.", "تقديم برامج توعوية مستمرة تقوم على التثقيف الصحي للأفراد من ذوي الإعاقة وأسرهم."]},
            {"kind": "cards", "heading": "تدريب المختصين ودور الأسرة", "intro": "يرتكز برنامجنا على ركيزتين أساسيتين: تطوير الكادر المتخصص، وتمكين الأسرة كشريك فاعل في رحلة التأهيل.", "cols": 2, "items": [
                {"title": "تدريب المختصين", "desc": "تهتم مراكز عبور بتطوير الكوادر العاملة لديها من خلال الدورات العلمية والورش التدريبية المتخصصة والتي يتم تقديمها عبر منصة تدريبية موحدة في مختلف المجالات المتعلقة بالتأهيل حسب جدول تدريبي مستمر يركز على التطوير والتحسين من جودة الأداء على كافة الأصعدة."},
                {"title": "دور الأسرة في عملية التأهيل", "desc": "تعد الأسرة شريكاً هاماً وأساسياً في تربية وتأهيل أبنائها من ذوي الإعاقة، وهي من أفضل المصادر للحصول على المعلومات في عملية تقييم الفرد وتحديد احتياجاته، كما أنها أكبر عون للمختصين خلال العملية التأهيلية. ونؤكد على ضرورة توثيق العلاقة بين المركز والأسرة وتفعيلها لتحقيق مصلحة الفرد."},
            ]},
        ],
    },
]


SERVICES_EN = [
    {
        "slug": "physical",
        "title": "Physical Therapy",
        "subtitle": "Providing the best therapeutic strategies for individuals with motor disorders and difficulties, to improve their ability to perform daily functions.",
        "image": "/figma/services/physical.jpg",
        "aboutHeading": "About Physical Therapy",
        "about": ["Oboor Centers strive to provide the best therapeutic strategies in the field of physical therapy for individuals who suffer from motor disorders and difficulties that affect movement during daily functioning. This is achieved through a comprehensive approach to prevention, diagnosis, and treatment of movement problems, motor disorders, and medical conditions, using various therapeutic exercises and physical modalities."],
        "blocks": [
            age_programs_en("(12 years and above)"),
            {"kind": "pills", "heading": "Target Groups", "dark": True, "items": ["Various developmental disorders", "Autism Spectrum Disorder", "Down syndrome", "Cerebral palsy", "Motor disabilities", "Spinal cord injuries", "Head injuries", "Gait disorders", "Muscular problems", "Rehabilitation of injuries and fractures", "Pre- and post-surgical rehabilitation"]},
            {"kind": "areas", "heading": "Areas of Training", "intro": "The physical therapy program covers nine integrated training areas that address all aspects of an individual's motor performance.", "items": [
                {"title": "Muscle Strength", "desc": "Enhancing the muscles' ability to generate force and perform movements efficiently and effectively"},
                {"title": "Muscle Tone", "desc": "Improving muscle flexibility and reducing excessive muscle tension for greater comfort"},
                {"title": "Range of Motion", "desc": "Expanding joint movement range and improving its natural and functional flexibility"},
                {"title": "Fine Motor Skills", "desc": "Developing the precision and coordination of hand and finger movements in daily tasks"},
                {"title": "Gross Motor Skills", "desc": "Improving large body movements such as walking, running, jumping, and mobility"},
                {"title": "Endurance", "desc": "Building the body's capacity to sustain motor performance for longer periods"},
                {"title": "Motor Coordination Skills", "desc": "Coordinating different body movements in a harmonious, synchronized, and smooth manner"},
                {"title": "Balance Skills", "desc": "Enhancing the ability to maintain body stability during movement and at rest"},
                {"title": "Motor Reflexes", "desc": "Developing the body's automatic, fast, and sound motor responses"},
            ]},
        ],
    },
    {
        "slug": "occupational",
        "title": "Occupational Therapy",
        "subtitle": "A specialized rehabilitation program aimed at developing independence skills and the ability to perform daily activities through individual treatment plans based on the latest occupational therapy methods.",
        "image": "/figma/services/occupational.jpg",
        "aboutHeading": "About Occupational Therapy",
        "about": ["Oboor Centers strive to provide the best therapeutic strategies in the field of occupational therapy for individuals with sensory, motor, cognitive, and social difficulties that affect independent performance in daily life. Occupational therapy aims to make the individual independent in the daily life functions they experience, with intervention based on internationally proven strategies."],
        "blocks": [
            age_programs_en("( 12 years and above )"),
            {"kind": "pills", "heading": "Target Groups", "dark": True, "items": ["Cerebral palsy", "Sensory disorders", "Autism Spectrum Disorder", "ADHD", "Head injuries", "Gait disorders", "Muscular problems", "Down syndrome", "Various developmental disorders", "Pre- and post-surgical rehabilitation", "Hearing disorders", "Learning Difficulties", "Intellectual disabilities", "Motor disabilities"]},
            {"kind": "areas", "heading": "Areas of Training", "intro": "Occupational therapy includes ten integrated training areas covering sensory, motor, cognitive, and social aspects of performance.", "items": [
                {"title": "Sensory Integration", "desc": "Organizing and integrating sensory information from the environment to improve appropriate behavioral responses"},
                {"title": "Daily Living Skills", "desc": "Training the individual to perform daily life activities with independence, flexibility, and confidence"},
                {"title": "Cognitive Skills", "desc": "Developing mental and cognitive abilities such as attention, memory, and problem-solving"},
                {"title": "Fine Motor Skills", "desc": "Improving the precision and coordination of finger and hand movements to perform delicate tasks"},
                {"title": "Gross Motor Skills", "desc": "Strengthening and coordinating large body movements such as walking, running, balance, and mobility"},
                {"title": "Motor Coordination Skills", "desc": "Enhancing the coordination and fluidity of body movements in a balanced sequence and rhythm"},
                {"title": "Visual-Motor Coordination Skills", "desc": "Linking visual information with precise motor responses to improve manual performance"},
                {"title": "Visual Perception Skills", "desc": "Developing the brain's ability to interpret, distinguish, and process visual information"},
                {"title": "Pre-Writing Skills", "desc": "Building the motor and cognitive foundations needed to learn writing correctly and properly"},
                {"title": "Social Skills", "desc": "Developing the abilities for communication and positive social interaction with peers and the surrounding environment"},
            ]},
        ],
    },
    {
        "slug": "psychological",
        "title": "Psychological Services",
        "subtitle": "Oboor Centers strive to provide psychological services at a high level of professional precision that contributes to improving the quality of life of people with disabilities, applying the latest treatment programs that help enhance the individual's personal, social, and professional abilities.",
        "image": "/figma/services/psychological.jpg",
        "aboutHeading": "About Psychological Services",
        "about": ["Oboor Centers provide specialized psychological services based on the latest scientific methods and therapeutic applications, with the aim of supporting people with disabilities and their families through psychological assessment, therapeutic interventions, and family counseling, contributing to improved quality of life and enhanced psychological and social adaptation."],
        "blocks": [
            {"kind": "cards", "heading": "Psychological Services Offered", "dark": True, "cols": 2, "items": [
                {"title": "Behavioral Therapy", "desc": "Through the design and formulation of treatment plans tailored to each case, based on the principles of Applied Behavior Analysis in understanding and improving behaviors, aiming to:", "bullets": [
                    "Contribute to increasing socially acceptable behaviors that the family seeks to achieve.",
                    "Help reduce socially unacceptable behaviors and learn effective methods of communicating with others.",
                    "Help cases overcome problems of fear and anxiety using evidence-based therapeutic methods.",
                    "Treat academic and social problems associated with developmental disorders.",
                ]},
                {"title": "Psychological Assessment", "desc": "Providing diagnostic services in the field of developmental disorders, including assessing the individual's cognitive and emotional functions, identifying their strengths and weaknesses, and offering professional recommendations based on assessment results to direct the case to appropriate programs."},
            ]},
            {"kind": "prose", "heading": "Counseling Programs Offered to Families", "paragraphs": ["Providing counseling programs that help offer psychological support to families, apply behavioral interventions, and generalize them in natural environments, making the family an essential partner in the individual's acquisition of daily life skills."]},
            {"kind": "pills", "heading": "Target Groups", "intro": "Providing counseling programs that help offer psychological support to families, apply behavioral interventions, and generalize them in natural environments, making the family an essential partner in the individual's acquisition of daily life skills.", "items": ["Down syndrome", "Intellectual disability", "Autism Spectrum Disorder", "ADHD", "All cases of developmental disorders", "Behavioral disorders", "Psychological disorders", "Learning Difficulties"]},
        ],
    },
    {
        "slug": "social",
        "title": "Social Services",
        "subtitle": "Social services aimed at developing the care provided to people with disabilities and their families according to the highest quality standards.",
        "image": "/figma/services/social.jpg",
        "aboutHeading": "About Social Services",
        "about": [
            "Oboor Centers strive to provide social services and develop the care offered to people with disabilities and their families according to the highest quality standards.",
            "This is achieved through a set of efforts that focus on supporting the family, promoting community integration, and activating supportive partnerships.",
        ],
        "blocks": [
            {"kind": "tiles", "heading": "Service Objectives", "dark": True, "cols": 4, "items": ["Helping to effectively integrate people with disabilities and their families into the community.", "Contributing to people with disabilities receiving early intervention services.", "Helping families overcome difficulties and empowering them to contribute effectively to developing their children's abilities.", "Providing professional intervention programs with the families of people with disabilities.", "Activating community partnerships that contribute to improving the quality of life of people with disabilities and their families.", "Establishing communication channels between official and supporting entities and the families of people with disabilities to help empower families to benefit from the services offered."]},
            {"kind": "tiles", "heading": "Importance of Social Services", "filled": True, "cols": 4, "items": ["Building effective ties with supporting entities", "Improving access to appropriate services", "Supporting community integration of people with disabilities", "Empowering families to fulfill their role more effectively"]},
        ],
    },
    {
        "slug": "speech",
        "title": "Speech & Language Therapy",
        "subtitle": "A specialized service aimed at diagnosing and treating speech and language disorders through individual programs based on a precise assessment of each individual's abilities, with the goal of improving communication skills and enhancing the ability to interact effectively in daily life.",
        "image": "/figma/services/speech.jpg",
        "aboutHeading": "About Speech & Language Therapy",
        "about": ["Oboor Centers are committed to providing complete care for individuals who suffer from speech and language disorders. Intervention begins from the moment the problem is discovered and at any age, by assessing the individual's abilities, identifying their strengths and weaknesses, and then setting a treatment plan suited to their diagnosis and abilities."],
        "aboutList": ["Assessment by a speech and language therapist to determine the appropriate treatment plan.", "Treatment and rehabilitation through individual training sessions determined according to the case.", "Training on the established plan using the tools and training methods suitable for the individual."],
        "blocks": [
            {"kind": "cards", "heading": "Speech & Language Therapy Programs", "intro": "At Oboor Centers, programs have been designed to suit individuals with disabilities, divided into 4 levels and various programs according to the individual's condition.", "dark": True, "cols": 2, "items": [
                {"title": "Level One", "desc": "It focuses on rehabilitating the individual in the early stages of training, addressing areas such as (requesting – imitation – receptive language – perception and matching – eye contact)."},
                {"title": "Level Two", "desc": "It focuses on developing the individual's language and speech skills, addressing areas such as (requesting with sentences – conversation – naming – imitation – following complex instructions) and other areas that help develop their language and dialogue."},
                {"title": "Level Three", "desc": "It qualifies the individual to communicate effectively with the outside community and integrate by increasing their ability to converse, read, understand dialogue, and participate in various topics."},
                {"title": "Level Four", "desc": "The auditory rehabilitation program is dedicated to individuals with hearing impairment and cochlear implants, focusing on training in sounds and relying on the sense of hearing to receive language rather than lip-reading."},
            ]},
            {"kind": "pills", "heading": "Target Groups", "intro": "Individuals who suffer from language, voice, or speech disorders across various age stages. The service is provided through a specialized team and specialized programs for all cases.", "items": ["Cochlear implant recipients", "Various syndromes", "Intellectual disability", "Autism Spectrum Disorder", "Voice disorders", "Learning Difficulties", "Cerebral palsy", "Hearing impairment of various degrees", "Language disorders (receptive – expressive – integrative)", "Speech disorders (delayed speech – stuttering – lisps – aphasia)"]},
        ],
    },
    {
        "slug": "nursing",
        "title": "Nursing Services",
        "subtitle": "A specialized service aimed at providing integrated healthcare within the center, through continuous monitoring of the medical condition and intervention when needed, while documenting medical procedures and providing the necessary health education to individuals and their families to ensure case stability and improve quality of life.",
        "image": "/figma/services/nursing.jpg",
        "aboutHeading": "About Nursing Services",
        "about": ["At Oboor Centers, we strive to provide complete medical care for individuals receiving rehabilitation within the center, reviewing their health history and development, monitoring the stability of their health condition, and intervening when needed. We document all medical procedures performed in a medical file dedicated to each individual and communicate with the physician following the case, after coordinating with the family as necessary. The role of nursing services is also highlighted in providing the necessary health awareness and education for families."],
        "aboutTag": {"heading": "Target Groups", "label": "Individuals with disabilities"},
        "blocks": [
            {"kind": "checklist", "heading": "Areas of Healthcare Provision", "dark": True, "items": ["Daily measurement of vital signs (temperature – blood pressure – pulse).", "Following up with individuals who have chronic diseases and providing the necessary care for them on a daily basis.", "Monitoring individuals' medication dosage schedules and administering them at the specified time.", "Handling daily emergency cases and taking the appropriate action.", "Providing ongoing awareness programs based on health education for individuals with disabilities and their families."]},
            {"kind": "cards", "heading": "Training Specialists and the Family's Role", "intro": "Our program rests on two essential pillars: developing the specialized staff, and empowering the family as an active partner in the rehabilitation journey.", "cols": 2, "items": [
                {"title": "Training Specialists", "desc": "Oboor Centers are committed to developing their staff through scientific courses and specialized training workshops delivered via a unified training platform across various rehabilitation-related fields, following a continuous training schedule focused on developing and improving the quality of performance at all levels."},
                {"title": "The Family's Role in the Rehabilitation Process", "desc": "The family is an important and essential partner in raising and rehabilitating their children with disabilities. It is one of the best sources of information in the process of assessing the individual and determining their needs, and it is also the greatest help to specialists during the rehabilitation process. We emphasize the necessity of strengthening and activating the relationship between the center and the family to serve the individual's best interest."},
            ]},
        ],
    },
]


class Command(BaseCommand):
    help = "Seed the ClinicalService table from the original site content."

    def handle(self, *args, **opts):
        en_by_slug = {s["slug"]: s for s in SERVICES_EN}
        created = updated = 0
        for i, ar in enumerate(SERVICES_AR):
            en = en_by_slug.get(ar["slug"], {})
            _, was_created = ClinicalService.objects.update_or_create(
                slug=ar["slug"],
                defaults=dict(
                    order=i, image=ar["image"], published=True,
                    title_ar=ar["title"], title_en=en.get("title", ""),
                    subtitle_ar=ar["subtitle"], subtitle_en=en.get("subtitle", ""),
                    about_heading_ar=ar["aboutHeading"], about_heading_en=en.get("aboutHeading", ""),
                    about_ar=ar["about"], about_en=en.get("about", []),
                    about_list_ar=ar.get("aboutList", []), about_list_en=en.get("aboutList", []),
                    about_tag_ar=ar.get("aboutTag", {}), about_tag_en=en.get("aboutTag", {}),
                    blocks_ar=ar["blocks"], blocks_en=en.get("blocks", []),
                ),
            )
            created += was_created
            updated += (not was_created)
        self.stdout.write(self.style.SUCCESS(f"Seeded clinical services: {created} created, {updated} updated."))
