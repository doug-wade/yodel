var users = {
    'noel': {
        username: 'noel',
        email: 'noel@yodel.to',
        password: 'testtest',
    },
    'ivan': {
        username: 'ivan',
        email: 'ivan@yodel.to',
        password: 'testtest',
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
        { "text" : "Artist", "checked" : false, "types" : [{"text" : "Studio Art", "checked" : false}, {"text" : "Hipster Art", "checked" : false}] },
        { "text" : "Musician", "checked" : false, "types" : [{"text" : "Folk Music", "checked" : false}, {"text" : "Thrash Metal", "checked" : false}] },
        { "text" : "Dancer", "checked" : false, "types" : [{"text" : "Ballet", "checked" : false}, {"text" : "Breakdance", "checked" : false}] },
        { "text" : "Actor", "checked" : false, "types" : [{"text" : "Theatre", "checked" : false}, {"text" : "Movie", "checked" : false}] },
        { "text" : "Sculptor", "checked" : false, "types" : [{"text" : "Bronze", "checked" : false}, {"text" : "Wood", "checked" : false}] },
        { "text" : "Singer", "checked" : false, "types" : [{"text" : "Opera", "checked" : false}, {"text" : "Yodeling", "checked" : false}] },
        { "text" : "Coder", "checked" : false, "types" : [{"text" : "C++", "checked" : false}, {"text" : "Javascript", "checked" : false}] },
        { "text" : "Acrobat", "checked" : false, "types" : [{"text" : "Circus", "checked" : false}, {"text" : "Kamasutra", "checked" : false}]},
        { "text" : "Pantomime", "checked" : false, "types" : [{"text" : "French Guy", "checked" : false}, {"text" : "Hipster Mime", "checked" : false}] },
        { "text" : "Poet", "checked" : false, "types" : [{"text" : "Postmodern", "checked" : false}, {"text" : "Slam Poetry", "checked" : false}] },
        { "text" : "Model", "checked" : false, "types" : [{"text" : "Hand", "checked" : false}, {"text" : "Full Body", "checked" : false}] },
        { "text" : "Photographer", "checked" : false, "types" : [{"text" : "War", "checked" : false}, {"text" : "Guerrila", "checked" : false}] }
    ];

module.exports = {
    users: users,
    userDetails: userDetails,
    userPortfolios: userPortfolios,
    userPortfolioItems: userPortfolioItems,
    disciplines: disciplines
};