export const LANGUAGES = [
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' }
];

export const DEFAULT_LANGUAGE = 'fr';

const categoryLabels = {
    fr: {
        LITTERATURE: 'Littérature (romans, nouvelles, poésie, théâtre)',
        RELIGIEUX: 'Livres religieux (exégèse, hadith, jurisprudence, théologie, comparaison des religions)',
        PHILOSOPHIE_PSYCHOLOGIE: 'Philosophie et psychologie (philosophie, développement personnel, psychologie, sociologie)',
        SCIENCES: 'Sciences (physique, chimie, biologie, mathématiques)',
        TECHNOLOGIE_INFORMATIQUE: 'Technologie et informatique (programmation, intelligence artificielle, réseaux, cybersécurité)',
        HISTOIRE_GEOGRAPHIE: 'Histoire et géographie (histoire, civilisations, géographie)',
        ECONOMIE_GESTION: 'Économie et gestion (marketing, comptabilité, entrepreneuriat, gestion de projet)',
        EDUCATIF_ACADEMIQUE: 'Livres éducatifs et académiques (manuels scolaires, livres universitaires, ouvrages de référence)',
        ARTS_CULTURE: 'Arts et culture (dessin, musique, cinéma, design)',
        ENFANTS: 'Livres pour enfants (contes, livres éducatifs, coloriage)',
        BIOGRAPHIES_MEMOIRES: 'Biographies et mémoires (récits de vie, autobiographies)',
        LOISIRS_STYLE_VIE: 'Loisirs et style de vie (cuisine, sport, voyage, jardinage)'
    },
    ar: {
        LITTERATURE: 'الأدب (روايات، قصص قصيرة، شعر، مسرح)',
        RELIGIEUX: 'كتب دينية (تفسير، حديث، فقه، عقيدة، مقارنة أديان)',
        PHILOSOPHIE_PSYCHOLOGIE: 'الفلسفة وعلم النفس (فلسفة، تطوير ذات، علم نفس، علم اجتماع)',
        SCIENCES: 'العلوم (فيزياء، كيمياء، أحياء، رياضيات)',
        TECHNOLOGIE_INFORMATIQUE: 'التكنولوجيا والمعلوماتية (برمجة، ذكاء اصطناعي، شبكات، أمن سيبراني)',
        HISTOIRE_GEOGRAPHIE: 'التاريخ والجغرافيا (تاريخ، حضارات، جغرافيا)',
        ECONOMIE_GESTION: 'الاقتصاد والإدارة (تسويق، محاسبة، ريادة أعمال، إدارة مشاريع)',
        EDUCATIF_ACADEMIQUE: 'كتب تعليمية وأكاديمية (كتب مدرسية، جامعية، مراجع)',
        ARTS_CULTURE: 'الفنون والثقافة (رسم، موسيقى، سينما، تصميم)',
        ENFANTS: 'كتب الأطفال (قصص، كتب تعليمية، تلوين)',
        BIOGRAPHIES_MEMOIRES: 'السير والمذكرات (قصص حياة، سير ذاتية)',
        LOISIRS_STYLE_VIE: 'الهوايات ونمط الحياة (طبخ، رياضة، سفر، بستنة)'
    },
    en: {
        LITTERATURE: 'Literature (novels, short stories, poetry, theater)',
        RELIGIEUX: 'Religious books (exegesis, hadith, jurisprudence, theology, comparative religion)',
        PHILOSOPHIE_PSYCHOLOGIE: 'Philosophy and psychology (philosophy, personal development, psychology, sociology)',
        SCIENCES: 'Sciences (physics, chemistry, biology, mathematics)',
        TECHNOLOGIE_INFORMATIQUE: 'Technology and computing (programming, artificial intelligence, networks, cybersecurity)',
        HISTOIRE_GEOGRAPHIE: 'History and geography (history, civilizations, geography)',
        ECONOMIE_GESTION: 'Economics and management (marketing, accounting, entrepreneurship, project management)',
        EDUCATIF_ACADEMIQUE: 'Educational and academic books (school textbooks, university books, reference works)',
        ARTS_CULTURE: 'Arts and culture (drawing, music, cinema, design)',
        ENFANTS: 'Children books (stories, educational books, coloring)',
        BIOGRAPHIES_MEMOIRES: 'Biographies and memoirs (life stories, autobiographies)',
        LOISIRS_STYLE_VIE: 'Leisure and lifestyle (cooking, sports, travel, gardening)'
    },
    de: {
        LITTERATURE: 'Literatur (Romane, Kurzgeschichten, Poesie, Theater)',
        RELIGIEUX: 'Religiöse Bücher (Exegese, Hadith, Rechtsprechung, Theologie, Religionsvergleich)',
        PHILOSOPHIE_PSYCHOLOGIE: 'Philosophie und Psychologie (Philosophie, Persönlichkeitsentwicklung, Psychologie, Soziologie)',
        SCIENCES: 'Naturwissenschaften (Physik, Chemie, Biologie, Mathematik)',
        TECHNOLOGIE_INFORMATIQUE: 'Technologie und Informatik (Programmierung, KI, Netzwerke, Cybersicherheit)',
        HISTOIRE_GEOGRAPHIE: 'Geschichte und Geografie (Geschichte, Zivilisationen, Geografie)',
        ECONOMIE_GESTION: 'Wirtschaft und Management (Marketing, Buchhaltung, Unternehmertum, Projektmanagement)',
        EDUCATIF_ACADEMIQUE: 'Bildungs- und Fachbücher (Schulbücher, Universitätsbücher, Nachschlagewerke)',
        ARTS_CULTURE: 'Kunst und Kultur (Zeichnen, Musik, Kino, Design)',
        ENFANTS: 'Kinderbücher (Geschichten, Lernbücher, Ausmalen)',
        BIOGRAPHIES_MEMOIRES: 'Biografien und Memoiren (Lebensgeschichten, Autobiografien)',
        LOISIRS_STYLE_VIE: 'Freizeit und Lifestyle (Kochen, Sport, Reisen, Gartenarbeit)'
    }
};

export const translations = {
    fr: {
        nav: {
            home: 'Accueil',
            libraries: 'Bibliothèques',
            books: 'Livres',
            members: 'Adhérents',
            loans: 'Emprunts',
            language: 'Langue'
        },
        common: {
            id: 'ID',
            name: 'Nom',
            address: 'Adresse',
            actions: 'Actions',
            cancel: 'Annuler',
            save: 'Enregistrer',
            update: 'Mettre à jour',
            delete: 'Supprimer',
            edit: 'Éditer',
            unknown: 'Inconnu',
            dash: '—',
            loading: 'Chargement...',
            total: 'Total',
            stock: 'Stock',
            book_one: 'livre',
            book_many: 'livre(s)'
        },
        home: {
            title: 'The Book Hunter Store',
            description: 'Découvrez notre collection de livres soigneusement sélectionnés. Gérez vos emprunts et adhérents avec élégance.',
            cta: 'Explorer la collection',
            imageAlt: 'Livre ouvert',
            stats: {
                books: 'Livres',
                members: 'Adhérents',
                loans: 'Emprunts',
                libraries: 'Bibliothèques'
            }
        },
        libraries: {
            title: 'Bibliothèques',
            add: '+ Nouvelle bibliothèque',
            namePlaceholder: 'Nom de la bibliothèque',
            empty: 'Aucune bibliothèque',
            createError: 'Erreur création bibliothèque !',
            deleteConfirm: 'Supprimer cette bibliothèque ?',
            deleteError: 'Erreur suppression !'
        },
        books: {
            title: 'Livres',
            add: '+ Nouveau livre',
            fields: {
                title: 'Titre',
                author: 'Auteur',
                isbn: 'ISBN',
                year: 'Année',
                quantity: 'Quantité',
                availability: 'Disponibilité',
                category: 'Catégorie',
                library: 'Bibliothèque'
            },
            placeholders: {
                title: 'Titre du livre',
                author: "Nom de l'auteur",
                isbn: 'ISBN',
                year: '2024',
                search: 'Rechercher par titre, auteur ou ISBN...',
                selectLibrary: 'Sélectionner une bibliothèque',
                selectCategory: 'Sélectionner une catégorie',
                allCategories: 'Toutes les catégories'
            },
            validations: {
                title: 'Veuillez saisir le titre.',
                author: "Veuillez saisir le nom de l'auteur.",
                isbn: "Veuillez saisir l'ISBN.",
                year: 'Veuillez saisir une année valide entre 1000 et {{maxYear}}.',
                quantity: 'La quantité doit être supérieure à 0.',
                library: 'Veuillez sélectionner une bibliothèque.',
                category: 'Veuillez sélectionner une catégorie.'
            },
            messages: {
                staticError: 'Impossible de charger les bibliothèques ou les catégories.',
                loadError: 'Impossible de charger les livres pour le moment.',
                saveError: "Impossible d'enregistrer le livre. Vérifiez les informations puis réessayez.",
                deleteError: 'Impossible de supprimer ce livre.',
                deleteConfirm: 'Supprimer ce livre ?',
                noFilterResults: 'Aucun livre ne correspond aux filtres sélectionnés.',
                empty: 'Aucun livre enregistré.',
                loadingBooks: 'Chargement des livres...',
                displayedCount: '{{count}} livre(s) affiché(s)',
                reset: 'Réinitialiser',
                cancelEdit: 'Annuler la modification'
            },
            availability: {
                unavailable: 'Indisponible',
                lowStock: 'Stock bas: {{count}}',
                available: 'Disponible: {{count}}'
            },
            categories: categoryLabels.fr
        },
        members: {
            title: 'Adhérents',
            add: '+ Nouvel adhérent',
            fullName: 'Nom & prénom',
            firstName: 'Prénom',
            email: 'Adresse email',
            phone: 'Téléphone',
            searchPlaceholder: 'Rechercher par nom, téléphone ou email...',
            empty: 'Aucun adhérent trouvé',
            invalidEmail: "Format d'email invalide",
            invalidPhone: 'Numéro de téléphone invalide',
            emailUsed: 'Email invalide ou déjà utilisé',
            saveError: 'Erreur enregistrement adhérent !',
            deleteConfirm: 'Supprimer cet adhérent ?',
            deleteError: 'Erreur suppression !'
        },
        loans: {
            title: 'Emprunts',
            tabs: {
                all: 'Tous les emprunts',
                overdue: 'En retard',
                history: 'Historique'
            },
            add: '+ Nouvel emprunt',
            fields: {
                member: 'Adhérent',
                books: 'Livres',
                loanDate: 'Date emprunt',
                plannedReturn: 'Retour prévu',
                actualReturn: 'Retour effectif',
                status: 'Statut',
                author: 'Auteur',
                quantity: 'Quantité',
                action: 'Action'
            },
            placeholders: {
                chooseMember: 'Choisir un adhérent...',
                chooseBook: 'Choisir un livre...'
            },
            validations: {
                member: 'Veuillez sélectionner un adhérent',
                loanDate: "Veuillez saisir la date d'emprunt",
                plannedReturn: 'Veuillez saisir la date de retour',
                plannedReturnAfterLoan: "La date de retour prévue doit être après la date d'emprunt",
                chooseBook: 'Veuillez sélectionner un livre',
                quantityPositive: 'La quantité doit être supérieure à 0',
                maxSameBook: 'Maximum {{max}} exemplaires du même livre',
                insufficientStock: 'Quantité insuffisante (disponible: {{stock}})',
                duplicateBook: 'Ce livre est déjà sélectionné'
            },
            messages: {
                maxBooks: 'Maximum {{max}} livres par emprunt',
                createError: 'Erreur création emprunt !',
                deleteConfirm: 'Supprimer cet emprunt ? Le stock sera restauré pour les livres non retournés.',
                deleteError: 'Erreur suppression !',
                returnAllConfirm: 'Retourner tous les livres de cet emprunt ?',
                returnOneConfirm: 'Retourner "{{title}}" ?',
                returnError: 'Erreur lors du retour !',
                count: '{{count}} emprunt(s)',
                empty: 'Aucun emprunt',
                details: 'Détail des livres empruntés',
                bookRowsTitle: 'Livres à emprunter',
                addBook: 'Ajouter un livre',
                summary: "Résumé de l'emprunt",
                saveLoan: "Enregistrer l'emprunt",
                overdueInfo: 'Emprunts dont la date de retour prévue est dépassée',
                selectMember: 'Sélectionner un adhérent'
            },
            status: {
                returned: 'Retourné',
                partial: 'Partiel',
                active: 'En cours'
            },
            actions: {
                fullReturn: 'Tout',
                returnBook: 'Retourner',
                fullReturnTitle: 'Retour complet',
                removeRowTitle: 'Supprimer cette ligne'
            }
        }
    },
    ar: {
        nav: { home: 'الرئيسية', libraries: 'المكتبات', books: 'الكتب', members: 'الأعضاء', loans: 'الإعارات', language: 'اللغة' },
        common: { id: 'المعرف', name: 'الاسم', address: 'العنوان', actions: 'الإجراءات', cancel: 'إلغاء', save: 'حفظ', update: 'تحديث', delete: 'حذف', edit: 'تعديل', unknown: 'غير معروف', dash: '—', loading: 'جار التحميل...', total: 'المجموع', stock: 'المخزون', book_one: 'كتاب', book_many: 'كتاب' },
        home: { title: 'The Book Hunter Store', description: 'اكتشف مجموعتنا المختارة بعناية من الكتب. أدر الإعارات والأعضاء بأناقة.', cta: 'استكشاف المجموعة', imageAlt: 'كتاب مفتوح', stats: { books: 'الكتب', members: 'الأعضاء', loans: 'الإعارات', libraries: 'المكتبات' } },
        libraries: { title: 'المكتبات', add: '+ مكتبة جديدة', namePlaceholder: 'اسم المكتبة', empty: 'لا توجد مكتبات', createError: 'خطأ في إنشاء المكتبة!', deleteConfirm: 'هل تريد حذف هذه المكتبة؟', deleteError: 'خطأ في الحذف!' },
        books: {
            title: 'الكتب',
            fields: { title: 'العنوان', author: 'المؤلف', isbn: 'ISBN', year: 'السنة', quantity: 'الكمية', availability: 'التوفر', category: 'الفئة', library: 'المكتبة' },
            add: '+ كتاب جديد',
            placeholders: { title: 'عنوان الكتاب', author: 'اسم المؤلف', isbn: 'ISBN', year: '2024', search: 'ابحث بالعنوان أو المؤلف أو ISBN...', selectLibrary: 'اختر مكتبة', selectCategory: 'اختر فئة', allCategories: 'كل الفئات' },
            validations: { title: 'يرجى إدخال العنوان.', author: 'يرجى إدخال اسم المؤلف.', isbn: 'يرجى إدخال ISBN.', year: 'يرجى إدخال سنة صالحة بين 1000 و {{maxYear}}.', quantity: 'يجب أن تكون الكمية أكبر من 0.', library: 'يرجى اختيار مكتبة.', category: 'يرجى اختيار فئة.' },
            messages: { staticError: 'تعذر تحميل المكتبات أو الفئات.', loadError: 'تعذر تحميل الكتب حاليا.', saveError: 'تعذر حفظ الكتاب. تحقق من المعلومات ثم حاول مرة أخرى.', deleteError: 'تعذر حذف هذا الكتاب.', deleteConfirm: 'هل تريد حذف هذا الكتاب؟', noFilterResults: 'لا يوجد كتاب يطابق عوامل التصفية المحددة.', empty: 'لا توجد كتب مسجلة.', loadingBooks: 'جار تحميل الكتب...', displayedCount: '{{count}} كتاب معروض', reset: 'إعادة ضبط', cancelEdit: 'إلغاء التعديل' },
            availability: { unavailable: 'غير متوفر', lowStock: 'مخزون منخفض: {{count}}', available: 'متوفر: {{count}}' },
            categories: categoryLabels.ar
        },
        members: { title: 'الأعضاء', add: '+ عضو جديد', fullName: 'الاسم واللقب', firstName: 'اللقب', email: 'البريد الإلكتروني', phone: 'الهاتف', searchPlaceholder: 'ابحث بالاسم أو الهاتف أو البريد...', empty: 'لم يتم العثور على أعضاء', invalidEmail: 'صيغة البريد الإلكتروني غير صحيحة', invalidPhone: 'رقم الهاتف غير صحيح', emailUsed: 'البريد غير صحيح أو مستخدم سابقا', saveError: 'خطأ في حفظ العضو!', deleteConfirm: 'هل تريد حذف هذا العضو؟', deleteError: 'خطأ في الحذف!' },
        loans: {
            title: 'الإعارات',
            tabs: { all: 'كل الإعارات', overdue: 'متأخرة', history: 'السجل' },
            add: '+ إعارة جديدة',
            fields: { member: 'العضو', books: 'الكتب', loanDate: 'تاريخ الإعارة', plannedReturn: 'العودة المتوقعة', actualReturn: 'العودة الفعلية', status: 'الحالة', author: 'المؤلف', quantity: 'الكمية', action: 'الإجراء' },
            placeholders: { chooseMember: 'اختر عضوا...', chooseBook: 'اختر كتابا...' },
            validations: { member: 'يرجى اختيار عضو', loanDate: 'يرجى إدخال تاريخ الإعارة', plannedReturn: 'يرجى إدخال تاريخ العودة', plannedReturnAfterLoan: 'يجب أن يكون تاريخ العودة بعد تاريخ الإعارة', chooseBook: 'يرجى اختيار كتاب', quantityPositive: 'يجب أن تكون الكمية أكبر من 0', maxSameBook: 'الحد الأقصى {{max}} نسخ من نفس الكتاب', insufficientStock: 'الكمية غير كافية (المتوفر: {{stock}})', duplicateBook: 'هذا الكتاب محدد بالفعل' },
            messages: { maxBooks: 'الحد الأقصى {{max}} كتب لكل إعارة', createError: 'خطأ في إنشاء الإعارة!', deleteConfirm: 'هل تريد حذف هذه الإعارة؟ سيتم استرجاع المخزون للكتب غير المعادة.', deleteError: 'خطأ في الحذف!', returnAllConfirm: 'هل تريد إرجاع كل كتب هذه الإعارة؟', returnOneConfirm: 'إرجاع "{{title}}"؟', returnError: 'خطأ أثناء الإرجاع!', count: '{{count}} إعارة', empty: 'لا توجد إعارات', details: 'تفاصيل الكتب المعارة', bookRowsTitle: 'الكتب المراد إعارتها', addBook: 'إضافة كتاب', summary: 'ملخص الإعارة', saveLoan: 'حفظ الإعارة', overdueInfo: 'الإعارات التي تجاوزت تاريخ العودة المتوقع', selectMember: 'اختر عضوا' },
            status: { returned: 'تم الإرجاع', partial: 'جزئي', active: 'قيد الإعارة' },
            actions: { fullReturn: 'الكل', returnBook: 'إرجاع', fullReturnTitle: 'إرجاع كامل', removeRowTitle: 'حذف هذا السطر' }
        }
    },
    en: {
        nav: { home: 'Home', libraries: 'Libraries', books: 'Books', members: 'Members', loans: 'Loans', language: 'Language' },
        common: { id: 'ID', name: 'Name', address: 'Address', actions: 'Actions', cancel: 'Cancel', save: 'Save', update: 'Update', delete: 'Delete', edit: 'Edit', unknown: 'Unknown', dash: '—', loading: 'Loading...', total: 'Total', stock: 'Stock', book_one: 'book', book_many: 'book(s)' },
        home: { title: 'The Book Hunter Store', description: 'Discover our carefully selected book collection. Manage loans and members with elegance.', cta: 'Explore the collection', imageAlt: 'Open book', stats: { books: 'Books', members: 'Members', loans: 'Loans', libraries: 'Libraries' } },
        libraries: { title: 'Libraries', add: '+ New library', namePlaceholder: 'Library name', empty: 'No libraries', createError: 'Library creation error!', deleteConfirm: 'Delete this library?', deleteError: 'Deletion error!' },
        books: {
            title: 'Books',
            add: '+ New book',
            fields: { title: 'Title', author: 'Author', isbn: 'ISBN', year: 'Year', quantity: 'Quantity', availability: 'Availability', category: 'Category', library: 'Library' },
            placeholders: { title: 'Book title', author: 'Author name', isbn: 'ISBN', year: '2024', search: 'Search by title, author, or ISBN...', selectLibrary: 'Select a library', selectCategory: 'Select a category', allCategories: 'All categories' },
            validations: { title: 'Please enter the title.', author: 'Please enter the author name.', isbn: 'Please enter the ISBN.', year: 'Please enter a valid year between 1000 and {{maxYear}}.', quantity: 'Quantity must be greater than 0.', library: 'Please select a library.', category: 'Please select a category.' },
            messages: { staticError: 'Unable to load libraries or categories.', loadError: 'Unable to load books right now.', saveError: 'Unable to save the book. Check the information and try again.', deleteError: 'Unable to delete this book.', deleteConfirm: 'Delete this book?', noFilterResults: 'No book matches the selected filters.', empty: 'No books saved.', loadingBooks: 'Loading books...', displayedCount: '{{count}} book(s) displayed', reset: 'Reset', cancelEdit: 'Cancel edit' },
            availability: { unavailable: 'Unavailable', lowStock: 'Low stock: {{count}}', available: 'Available: {{count}}' },
            categories: categoryLabels.en
        },
        members: { title: 'Members', add: '+ New member', fullName: 'Name & first name', firstName: 'First name', email: 'Email address', phone: 'Phone', searchPlaceholder: 'Search by name, phone, or email...', empty: 'No members found', invalidEmail: 'Invalid email format', invalidPhone: 'Invalid phone number', emailUsed: 'Email is invalid or already used', saveError: 'Member save error!', deleteConfirm: 'Delete this member?', deleteError: 'Deletion error!' },
        loans: {
            title: 'Loans',
            tabs: { all: 'All loans', overdue: 'Overdue', history: 'History' },
            add: '+ New loan',
            fields: { member: 'Member', books: 'Books', loanDate: 'Loan date', plannedReturn: 'Planned return', actualReturn: 'Actual return', status: 'Status', author: 'Author', quantity: 'Quantity', action: 'Action' },
            placeholders: { chooseMember: 'Choose a member...', chooseBook: 'Choose a book...' },
            validations: { member: 'Please select a member', loanDate: 'Please enter the loan date', plannedReturn: 'Please enter the return date', plannedReturnAfterLoan: 'The planned return date must be after the loan date', chooseBook: 'Please select a book', quantityPositive: 'Quantity must be greater than 0', maxSameBook: 'Maximum {{max}} copies of the same book', insufficientStock: 'Insufficient quantity (available: {{stock}})', duplicateBook: 'This book is already selected' },
            messages: { maxBooks: 'Maximum {{max}} books per loan', createError: 'Loan creation error!', deleteConfirm: 'Delete this loan? Stock will be restored for books not returned.', deleteError: 'Deletion error!', returnAllConfirm: 'Return all books in this loan?', returnOneConfirm: 'Return "{{title}}"?', returnError: 'Return error!', count: '{{count}} loan(s)', empty: 'No loans', details: 'Borrowed book details', bookRowsTitle: 'Books to borrow', addBook: 'Add a book', summary: 'Loan summary', saveLoan: 'Save loan', overdueInfo: 'Loans whose planned return date has passed', selectMember: 'Select a member' },
            status: { returned: 'Returned', partial: 'Partial', active: 'Active' },
            actions: { fullReturn: 'All', returnBook: 'Return', fullReturnTitle: 'Full return', removeRowTitle: 'Remove this row' }
        }
    },
    de: {
        nav: { home: 'Start', libraries: 'Bibliotheken', books: 'Bücher', members: 'Mitglieder', loans: 'Ausleihen', language: 'Sprache' },
        common: { id: 'ID', name: 'Name', address: 'Adresse', actions: 'Aktionen', cancel: 'Abbrechen', save: 'Speichern', update: 'Aktualisieren', delete: 'Löschen', edit: 'Bearbeiten', unknown: 'Unbekannt', dash: '—', loading: 'Wird geladen...', total: 'Gesamt', stock: 'Bestand', book_one: 'Buch', book_many: 'Buch/Bücher' },
        home: { title: 'The Book Hunter Store', description: 'Entdecken Sie unsere sorgfältig ausgewählte Büchersammlung. Verwalten Sie Ausleihen und Mitglieder elegant.', cta: 'Sammlung erkunden', imageAlt: 'Offenes Buch', stats: { books: 'Bücher', members: 'Mitglieder', loans: 'Ausleihen', libraries: 'Bibliotheken' } },
        libraries: { title: 'Bibliotheken', add: '+ Neue Bibliothek', namePlaceholder: 'Name der Bibliothek', empty: 'Keine Bibliotheken', createError: 'Fehler beim Erstellen der Bibliothek!', deleteConfirm: 'Diese Bibliothek löschen?', deleteError: 'Fehler beim Löschen!' },
        books: {
            title: 'Bücher',
            add: '+ Neues Buch',
            fields: { title: 'Titel', author: 'Autor', isbn: 'ISBN', year: 'Jahr', quantity: 'Menge', availability: 'Verfügbarkeit', category: 'Kategorie', library: 'Bibliothek' },
            placeholders: { title: 'Buchtitel', author: 'Name des Autors', isbn: 'ISBN', year: '2024', search: 'Nach Titel, Autor oder ISBN suchen...', selectLibrary: 'Bibliothek auswählen', selectCategory: 'Kategorie auswählen', allCategories: 'Alle Kategorien' },
            validations: { title: 'Bitte geben Sie den Titel ein.', author: 'Bitte geben Sie den Autorennamen ein.', isbn: 'Bitte geben Sie die ISBN ein.', year: 'Bitte geben Sie ein gültiges Jahr zwischen 1000 und {{maxYear}} ein.', quantity: 'Die Menge muss größer als 0 sein.', library: 'Bitte wählen Sie eine Bibliothek.', category: 'Bitte wählen Sie eine Kategorie.' },
            messages: { staticError: 'Bibliotheken oder Kategorien konnten nicht geladen werden.', loadError: 'Bücher können derzeit nicht geladen werden.', saveError: 'Das Buch konnte nicht gespeichert werden. Prüfen Sie die Angaben und versuchen Sie es erneut.', deleteError: 'Dieses Buch konnte nicht gelöscht werden.', deleteConfirm: 'Dieses Buch löschen?', noFilterResults: 'Kein Buch passt zu den ausgewählten Filtern.', empty: 'Keine Bücher gespeichert.', loadingBooks: 'Bücher werden geladen...', displayedCount: '{{count}} Buch/Bücher angezeigt', reset: 'Zurücksetzen', cancelEdit: 'Bearbeitung abbrechen' },
            availability: { unavailable: 'Nicht verfügbar', lowStock: 'Niedriger Bestand: {{count}}', available: 'Verfügbar: {{count}}' },
            categories: categoryLabels.de
        },
        members: { title: 'Mitglieder', add: '+ Neues Mitglied', fullName: 'Name & Vorname', firstName: 'Vorname', email: 'E-Mail-Adresse', phone: 'Telefon', searchPlaceholder: 'Nach Name, Telefon oder E-Mail suchen...', empty: 'Keine Mitglieder gefunden', invalidEmail: 'Ungültiges E-Mail-Format', invalidPhone: 'Ungültige Telefonnummer', emailUsed: 'E-Mail ist ungültig oder bereits vergeben', saveError: 'Fehler beim Speichern des Mitglieds!', deleteConfirm: 'Dieses Mitglied löschen?', deleteError: 'Fehler beim Löschen!' },
        loans: {
            title: 'Ausleihen',
            tabs: { all: 'Alle Ausleihen', overdue: 'Überfällig', history: 'Historie' },
            add: '+ Neue Ausleihe',
            fields: { member: 'Mitglied', books: 'Bücher', loanDate: 'Ausleihdatum', plannedReturn: 'Geplante Rückgabe', actualReturn: 'Tatsächliche Rückgabe', status: 'Status', author: 'Autor', quantity: 'Menge', action: 'Aktion' },
            placeholders: { chooseMember: 'Mitglied auswählen...', chooseBook: 'Buch auswählen...' },
            validations: { member: 'Bitte wählen Sie ein Mitglied', loanDate: 'Bitte geben Sie das Ausleihdatum ein', plannedReturn: 'Bitte geben Sie das Rückgabedatum ein', plannedReturnAfterLoan: 'Das geplante Rückgabedatum muss nach dem Ausleihdatum liegen', chooseBook: 'Bitte wählen Sie ein Buch', quantityPositive: 'Die Menge muss größer als 0 sein', maxSameBook: 'Maximal {{max}} Exemplare desselben Buches', insufficientStock: 'Unzureichende Menge (verfügbar: {{stock}})', duplicateBook: 'Dieses Buch ist bereits ausgewählt' },
            messages: { maxBooks: 'Maximal {{max}} Bücher pro Ausleihe', createError: 'Fehler beim Erstellen der Ausleihe!', deleteConfirm: 'Diese Ausleihe löschen? Der Bestand wird für nicht zurückgegebene Bücher wiederhergestellt.', deleteError: 'Fehler beim Löschen!', returnAllConfirm: 'Alle Bücher dieser Ausleihe zurückgeben?', returnOneConfirm: '"{{title}}" zurückgeben?', returnError: 'Fehler bei der Rückgabe!', count: '{{count}} Ausleihe(n)', empty: 'Keine Ausleihen', details: 'Details der ausgeliehenen Bücher', bookRowsTitle: 'Bücher zum Ausleihen', addBook: 'Buch hinzufügen', summary: 'Ausleihübersicht', saveLoan: 'Ausleihe speichern', overdueInfo: 'Ausleihen, deren geplantes Rückgabedatum überschritten ist', selectMember: 'Mitglied auswählen' },
            status: { returned: 'Zurückgegeben', partial: 'Teilweise', active: 'Aktiv' },
            actions: { fullReturn: 'Alle', returnBook: 'Zurückgeben', fullReturnTitle: 'Vollständige Rückgabe', removeRowTitle: 'Diese Zeile entfernen' }
        }
    }
};
