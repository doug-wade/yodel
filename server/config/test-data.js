var projects =
    [
        { 'name': 'Yodel!',
          'subhead': 'Write an application that allows collaboration between artists, organizations, and patrons.',
          'id': 'd6e58b89-1f18-46c8-9ed6-df7229da5697',
          'collaborators': ['noel', 'ivan'],
          'description': 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?'
        },
        {
          'name': 'Three Suites in a suite',
          'subhead': "Play Duke Ellington's Three Suites (Peer Gynt, Nutcracker, and Suite Thursday) in a hotel suite.",
          'id': 'da7f821f-e389-4d27-ba86-b66f92fbd9d8',
          'collaborators': ['noel', 'ivan'],
          'description': 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?'
        }
    ];

var users = {
    'noel': {
        username: 'noel',
        email: 'noel@yodel.to',
        password: 'testtest',
        projects: projects
    },
    'ivan': {
        username: 'ivan',
        email: 'ivan@yodel.to',
        password: 'testtest',
        projects: projects
    }
};

var userDetails = {
    'noel': {
        fullName: 'Noel Sardana',
        artistType: 'Hipster Coder',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        banner: 'noel/banner.jpg'
    },
    'ivan': {
        fullName: 'Ivan Melyakov',
        artistType: 'Coder Bro',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        banner: 'ivan/banner.png',
        profilePic: 'ivan/profile.jpg'
    }
};

var userPortfolios = {
    'noel': [
        {
            portfolioId: 1,
            imageUrl: 'noel/spring.jpg',
            title: 'Chaplin Collection',
            date: Date.now(),
            description: 'Flowers, trees, and bees'
        },
        {
            portfolioId: 2,
            imageUrl: 'noel/winter.jpg',
            title: 'Winter Collection',
            date: Date.now(),
            description: 'Hot cocoa and snow angels'
        }
    ],
    'ivan': [
        {
            portfolioId: 3,
            imageUrl: 'ivan/seattle.jpg',
            title: 'Sounds of Seattle',
            date: Date.now(),
            description: 'There ain\'t no riot here...'
        }
    ]
};

var userPortfolioItems = {
    'noel': {
        'Chaplin Collection': [
            {
                itemId: 1,
                resourceUrl: 'noel/happy-chaplin.jpg',
                resourceType: 'picture',
                caption: 'Happy Chaplin',
                likes: 1,
                comments: 0
            },
            {
                itemId: 2,
                resourceUrl: 'noel/pointy-chaplin.jpg',
                resourceType: 'picture',
                caption: 'Pointy Chaplin',
                likes: 2,
                comments: 2
            },
            {
                itemId: 3,
                resourceUrl: 'noel/sleepy-chaplin.jpg',
                resourceType: 'picture',
                caption: 'Sleepy Chaplin',
                likes: 0,
                comments: 0
            },
            {
                itemId: 4,
                resourceUrl: 'noel/sneaky-chaplin.jpg',
                resourceType: 'picture',
                caption: 'Sneaky Chaplin',
                likes: 0,
                comments: 0
            }
        ],
        'Winter Collection': []
    },
    'ivan': {
        'Sounds of Seattle': [
            {
                itemId: 3,
                resourceUrl: 'ivan/edibles.jpg',
                resourceType: 'lyric',
                caption: 'edibles',
                likes: 1000000,
                comments: 0
            }
        ]
    }
};

var disciplines =
    [
        { 'text': 'Artist', 'checked': false, 'types': [{'text': 'Studio Art', 'checked': false}, {'text': 'Hipster Art', 'checked': false}] },
        { 'text': 'Musician', 'checked': false, 'types': [{'text': 'Folk Music', 'checked': false}, {'text': 'Thrash Metal', 'checked': false}] },
        { 'text': 'Dancer', 'checked': false, 'types': [{'text': 'Ballet', 'checked': false}, {'text': 'Breakdance', 'checked': false}] },
        { 'text': 'Actor', 'checked': false, 'types': [{'text': 'Theatre', 'checked': false}, {'text': 'Movie', 'checked': false}] },
        { 'text': 'Sculptor', 'checked': false, 'types': [{'text': 'Bronze', 'checked': false}, {'text': 'Wood', 'checked': false}] },
        { 'text': 'Singer', 'checked': false, 'types': [{'text': 'Opera', 'checked': false}, {'text': 'Yodeling', 'checked': false}] },
        { 'text': 'Coder', 'checked': false, 'types': [{'text': 'C++', 'checked': false}, {'text': 'Javascript', 'checked': false}] },
        { 'text': 'Acrobat', 'checked': false, 'types': [{'text': 'Circus', 'checked': false}, {'text': 'Kamasutra', 'checked': false}]},
        { 'text': 'Pantomime', 'checked': false, 'types': [{'text': 'French Guy', 'checked': false}, {'text': 'Hipster Mime', 'checked': false}] },
        { 'text': 'Poet', 'checked': false, 'types': [{'text': 'Postmodern', 'checked': false}, {'text': 'Slam Poetry', 'checked': false}] },
        { 'text': 'Model', 'checked': false, 'types': [{'text': 'Hand', 'checked': false}, {'text': 'Full Body', 'checked': false}] },
        { 'text': 'Photographer', 'checked': false, 'types': [{'text': 'War', 'checked': false}, {'text': 'Guerrila', 'checked': false}] }
    ];

module.exports = {
    users: users,
    userDetails: userDetails,
    userPortfolios: userPortfolios,
    userPortfolioItems: userPortfolioItems,
    disciplines: disciplines,
    projects: projects
};
