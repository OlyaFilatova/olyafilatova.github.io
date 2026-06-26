import { KnowledgeSource } from '../schemas/knowledge-source.ts';

export const knowledgeSources: KnowledgeSource[] = [
  {
    "kind": "book",
    "status": "in-progress-first-read",
    "title": {
      "en": "Professor Frisby's Mostly Adequate Guide to Functional Programming",
      "ua": "Professor Frisby's Mostly Adequate Guide to Functional Programming"
    },
    "access": "free",
    "link": "https://github.com/MostlyAdequate/mostly-adequate-guide",
    "thoughts": [
      {
        "en": "Before starting the book, I expected to read about usual code structure changes. But the first chapter introduced me to the idea that functional programs are not \"function\"-al from the coding point of view but from the point of view of mathematics. It was fascinating to watch how the decision to abandon functions' names and replace them with the usual '+' and '*' operations allowed us to simplify the call chain using the rules of algebra. But now I wonder how the style of the code comments must change with this paradigma.",
        "ua": "До того як почати читати книгу я очікувала звичайних змін у структурі коду. Але перший розділ познайомив мене з ідеєю про те, що функціональні програми не є \"функціо\" з точки зору термінів коду, а з точки зору термінів математики. Спостерігати за тим, як рішення відмовитися від назв функцій та замінити їх на звичайні операції '+' та '*' дозволило спростити ланцюжок викликів за допомогою правил алгебри, було вкрай захопливо. Але тепер мені цікаво, наскільки стиль коментарів до коду повинен змінитися з цією парадигмою."
      },
      {
        "en": "First class functions == Beware of the redundant wrapper funtions.",
        "ua": "First class functions == Остерігайтеся зайвих функцій-обгорток."
      },
      {
        "en": "By using specific naming, we limit reusability.",
        "ua": "Використовуючи специфічні імена, ми обмежуємо можливість повторного використання."
      },
      {
        "en": "Pure function == same inputs always create same outputs; no observable side effects (interactions with the world outside of a function) present. No dependence on the changing system state.",
        "ua": "Pure function == однакові вхідні дані завжди створюють однакові вихідні дані; жодних побічних ефектів (взаємодій зі світом поза функцією). Відсутність залежності від змін стану системи."
      },
      {
        "en": "Currying is used to \"pre-load\" a function with part of its arguments.",
        "ua": "Currying використовується для того, щоб \"предзавантажити\" функцію з частиною її аргументів."
      },
      {
        "en": "compose == simplifying view of nested calls into a list of functions to call. (read functions list right to left)",
        "ua": "compose == спрощення вкладених викликів функцій у список функцій, що будуть викликані. (читай список функцій справа на ліво)"
      },
      {
        "en": "Into 5th chapter now and feel like the connection to math is not so apparent anymore. ...till the Category Theory section. I would like to see a more examples of category theory in code though.",
        "ua": "Поки читала 5ий розділ виникло відчуття, що звʼязку з математикою знову не видно. ...поки не почала читати секцію \"Category Theory\". Хотілось би побачити більше прикладів category theory в коді."
      },
      {
        "en": "What is most noticeable now is that functions are becoming very short and there are quite a lot of them.",
        "ua": "Більш за все зараз кидається в очі те, що функції стають дуже короткими і їх стає доволі багато."
      },
      {
        "en": "Hindley-Milner type signature. Using it allows to search for existing functions (ex. https://hoogle.haskell.org/). Also it helps to analyze function from the math PoV.",
        "ua": "Сигнатура типу Хіндлі-Мілнера. Її використання дозволяє знаходити існуючі функції (наприклад https://hoogle.haskell.org/). Також вона допомагає аналізувати функцію з точки зору математики."
      },
      {
        "en": "Got to chapter about Container and Functors and they have class structure at its core. Not something that I was expecting from functional programming.",
        "ua": "Дійшла до розділу про контейнери та функтори, а вони створюються на основі класів. Не те, чого я очікувала від функціонального програмування."
      },
      {
        "en": "What takes me some time to get used to is definitely the reading of application code bottom to top and right to left.",
        "ua": "До чого мені важко звикнути, так це до читання коду програми знизу вгору та справа наліво."
      },
      {
        "en": "For a person that have been writing in imperative style for quite a long time at the first read the imperative style is still much more readable. But I understand that with all the functors/monads and operator functions predefined in a library the code becomes much smaller and for a person experienced in functional programming it becomes more readable.",
        "ua": "Для людини, яка вже досить довго пише в імперативному стилі, при першому прочитанні імперативний стиль все ще набагато читабельніший. Але я розумію, що з усіма функторами/монадами та операторними функціями, попередньо визначеними в бібліотеці, код стає набагато меншим, а для досвідченого у функціональному програмуванні розробника більш читабельним."
      }
    ]
  },
  {
    "kind": "book",
    "status": "in-progress-first-read",
    "title": {
      "en": "You Don't Know JS (1st and 2nd editions)",
      "ua": "You Don't Know JS (1st and 2nd editions)"
    },
    "access": "free",
    "link": "https://github.com/getify/You-Dont-Know-JS",
    "thoughts": [
      {
        "en": "Sometimes come as too opinionated but is a great read to improve grasp on JS. I've put the read on a pause but I definitely recommend these and plan to read all of them myself. What I like about these, that they are not the usual quick intro books but a thorough study of the topics.",
        "ua": "Іноді здаються надто упередженими, але це чудові книги для покращення розуміння JS. Поки поставила читання цих книжок на паузу, але точно раджу до читання і сама планую прочитати всі ці книги. Це не звичний швидкий вступ у мову, а ретельне опрацювання тем."
      }
    ]
  }
];
