const b = (title, author, genre, blurb) => ({ title, author, genre, blurb });

module.exports = {
  happy: { label: 'Happy', emoji: '😊', color: '#E8A317',
    keywords: ['happy','joy','joyful','great','good','cheerful','excited','fun','laugh','funny','upbeat','glad','delighted','awesome'],
    intro: 'Keep the good mood going with stories that sparkle.',
    books: [
      b('The House in the Cerulean Sea','T.J. Klune','Fantasy','A caseworker finds a found family on a magical island of unusual children.'),
      b('Anxious People','Fredrik Backman','Fiction','A failed bank robbery turns into a funny, warm story about human frailty.'),
      b("The Hitchhiker's Guide to the Galaxy",'Douglas Adams','Sci-Fi','Absurd, quotable space comedy that begins with the Earth being demolished.'),
      b("Where'd You Go, Bernadette",'Maria Semple','Fiction','A sharp, comic mystery about a brilliant mother who vanishes.')
    ] },
  sad: { label: 'Sad', emoji: '😢', color: '#3B6EA8',
    keywords: ['sad','down','blue','cry','crying','lonely','grief','heartbroken','depressed','low','miss','hurt','melancholy','tearful','unhappy'],
    intro: 'Gentle, honest books that sit with you and offer some light.',
    books: [
      b('A Man Called Ove','Fredrik Backman','Fiction','A grumpy widower is slowly pulled back into life by his neighbours.'),
      b('The Midnight Library','Matt Haig','Fiction','Between life and death, a woman tries the lives she might have lived.'),
      b('When Breath Becomes Air','Paul Kalanithi','Memoir','A neurosurgeon faces terminal illness and asks what makes life meaningful.'),
      b('The Kite Runner','Khaled Hosseini','Fiction','A story of friendship, guilt and redemption in Afghanistan.')
    ] },
  motivated: { label: 'Motivated', emoji: '🔥', color: '#D6452B',
    keywords: ['motivated','motivate','inspired','driven','productive','ambitious','focus','goal','goals','determined','energetic','hustle','discipline','success','grow'],
    intro: 'Fuel for the fire: practical ideas you can act on today.',
    books: [
      b('Atomic Habits','James Clear','Self-help','Small daily changes that compound into remarkable results.'),
      b("Can't Hurt Me",'David Goggins','Memoir','A raw account of building mental toughness from nothing.'),
      b('Mindset','Carol Dweck','Self-help','How believing you can improve changes what you achieve.'),
      b('The Alchemist','Paulo Coelho','Fiction','A shepherd follows his dream across the desert in this modern fable.')
    ] },
  adventurous: { label: 'Adventurous', emoji: '🧭', color: '#2E8B57',
    keywords: ['adventurous','adventure','travel','explore','wander','wanderlust','bold','daring','journey','quest','restless','thrill','outdoors','escape'],
    intro: 'Pack a bag. These books take you somewhere far away.',
    books: [
      b('The Hobbit','J.R.R. Tolkien','Fantasy','A reluctant hobbit joins dwarves on a quest to reclaim a treasure.'),
      b('Life of Pi','Yann Martel','Adventure','A boy survives at sea with a Bengal tiger. Is the story true?'),
      b('Into the Wild','Jon Krakauer','Adventure','The true story of a young man who walked into the Alaskan wilderness.'),
      b('Treasure Island','Robert Louis Stevenson','Classic','Pirates, a map and a boy caught up in the greatest sea tale.')
    ] },
  relaxed: { label: 'Relaxed', emoji: '🌿', color: '#5E9C8F',
    keywords: ['relaxed','relax','calm','chill','peaceful','cozy','cosy','sleepy','slow','quiet','easy','comfort','unwind','tea','lazy','weekend'],
    intro: 'Soft, slow reads to unwind with, ideally with a hot drink.',
    books: [
      b('Legends & Lattes','Travis Baldree','Fantasy','An orc retires from adventuring to open the first coffee shop in town.'),
      b("Howl's Moving Castle",'Diana Wynne Jones','Fantasy',"A hat-maker is cursed and finds shelter in a wizard's walking castle."),
      b('A Gentleman in Moscow','Amor Towles','Fiction','A count is sentenced to live in a grand hotel and makes a rich world of it.'),
      b('The Little Prince','Antoine de Saint-Exupéry','Classic','A short, tender fable about love, loss and what matters.')
    ] },
  curious: { label: 'Curious', emoji: '🔭', color: '#7A4FB5',
    keywords: ['curious','curiosity','wonder','learn','learning','think','thinking','science','why','how','understand','bored','knowledge','mind'],
    intro: 'Big questions and bigger ideas to feed your curiosity.',
    books: [
      b('Sapiens','Yuval Noah Harari','Non-fiction','A sweeping history of how humans came to dominate the planet.'),
      b('Cosmos','Carl Sagan','Science','A poetic tour of the universe and our place inside it.'),
      b('A Brief History of Time','Stephen Hawking','Science','Black holes, the Big Bang and the nature of time, in plain language.'),
      b("Sophie's World",'Jostein Gaarder','Fiction','A novel that teaches the history of philosophy through a mystery.')
    ] },
  anxious: { label: 'Anxious', emoji: '🌧️', color: '#6B7A8F',
    keywords: ['anxious','anxiety','stressed','stress','worried','worry','overwhelmed','nervous','panic','tense','burnout','burned','tired','exhausted','overthinking'],
    intro: 'Kind, grounding reads to slow your thoughts down.',
    books: [
      b('The Comfort Book','Matt Haig','Self-help','Short notes, lists and reminders to hold on to in dark moments.'),
      b('Wintering','Katherine May','Memoir',"How to rest and heal during life's fallow seasons."),
      b('Maybe You Should Talk to Someone','Lori Gottlieb','Memoir','A therapist becomes a patient. Funny, humane and insightful.'),
      b('The Power of Now','Eckhart Tolle','Self-help','A guide to quieting the mind by living in the present moment.')
    ] },
  romantic: { label: 'Romantic', emoji: '💞', color: '#C2477A',
    keywords: ['romantic','romance','love','loving','crush','date','dating','heart','butterflies','affection','soft','longing','passion','valentine'],
    intro: 'Swoony stories for a full heart.',
    books: [
      b('Pride and Prejudice','Jane Austen','Classic','Wit, manners and the most famous slow-burn in English literature.'),
      b('Beach Read','Emily Henry','Romance','Two rival writers swap genres for a summer and fall for each other.'),
      b('Me Before You','Jojo Moyes','Romance',"A caregiver and a paralysed man change each other's lives."),
      b('Normal People','Sally Rooney','Fiction','Two young people drift together and apart across the years.')
    ] }
};
