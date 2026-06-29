import { KnowledgeSource } from '../schemas/knowledge-source.ts';

export const knowledgeSources: KnowledgeSource[] = [
  {
    "kind": "book",
    "status": "first-read",
    "title": {
      "en": "Professor Frisby's Mostly Adequate Guide to Functional Programming",
      "uk": "Professor Frisby's Mostly Adequate Guide to Functional Programming"
    },
    "access": "free",
    "link": "https://github.com/MostlyAdequate/mostly-adequate-guide",
    "thoughts": [
      {
        "en": "The book dives into following terms of functional programming: First class functions, Pure functions, Side effect, Currying, Pointfree, Composition, Morphisms, Categories, Hindley-Milner type signature, Containers, Functors, Algebraic structures, Pointed functors, Default minimal context, Monads, Applicative functors, Natural transformations, Isomorphism, Traversable, Semigroups, Monoids, Endomorphisms, Endofunctors.",
        "uk": "Книга заглиблюється в наступні терміни функціонального програмування: First class functions, Pure functions, Side effect, Currying, Pointfree, Composition, Morphisms, Categories, Hindley-Milner type signature, Containers, Functors, Algebraic structures, Pointed functors, Default minimal context, Monads, Applicative functors, Natural transformations, Isomorphism, Traversable, Semigroups, Monoids, Endomorphisms, Endofunctors."
      },
      {
        "en": "Explains inner workings and use cases of several common use Functors: Identity, Compose, Maybe, Either(Right, Left), IO, Task, Map.",
        "uk": "Пояснює внутрішню роботу та варіанти використання кількох поширених функторів: Identity, Compose, Maybe, Either(Right, Left), IO, Task, Map."
      },
      {
        "en": "Shows how to implement control flow, error handling, asynchronous actions, side effects with functional approach. Provides a simple example of a website written with functional approach: request and display list of images.",
        "uk": "Показує, як реалізувати потік керування, обробку помилок, асинхронні дії, побічні ефекти за допомогою функціонального підходу. Надає простий приклад веб-сайту, написаного з використанням функціонального підходу: запит та відображення списку зображень."
      },
      {
        "en": "It teaches reader to see code through the prism of abstract algebra using category theory and group theory with use of helpful visuals.",
        "uk": "Ця книга навчає читача бачити код крізь призму абстрактної алгебри, використовуючи теорію категорій та теорію груп."
      },
      {
        "en": "Before starting the book, I expected to read about usual code structure changes. But the first chapter introduced me to the idea that functional programs are not \"function\"-al from the coding point of view but from the point of view of mathematics. It was fascinating to watch how the decision to abandon functions' names and replace them with the usual '+' and '*' operations allowed us to simplify the call chain using the rules of arithmetic. But now I wonder how the style of the code comments must change with this paradigma.",
        "uk": "До того як почати читати книгу я очікувала звичайних змін у структурі коду. Але перший розділ познайомив мене з ідеєю про те, що функціональні програми не є \"функціо\" з точки зору термінів коду, а з точки зору термінів математики. Спостерігати за тим, як рішення відмовитися від назв функцій та замінити їх на звичайні операції '+' та '*' дозволило спростити ланцюжок викликів за допомогою правил арифметики, було вкрай захопливо. Але тепер мені цікаво, наскільки стиль коментарів до коду повинен змінитися з цією парадигмою."
      },
      {
        "en": "Into 5th chapter now and feel like the connection to math is not so apparent anymore. ...till the Category Theory section.",
        "uk": "Поки читала 5ий розділ виникло відчуття, що звʼязку з математикою знову не видно. ...поки не почала читати секцію \"Category Theory\"."
      },
      {
        "en": "Got to chapter about Container and Functors and they have class structure at its core. Not something that I was expecting from functional programming.",
        "uk": "Дійшла до розділу про контейнери та функтори, а вони створюються на основі класів. Не те, чого я очікувала від функціонального програмування."
      },
      {
        "en": "Functions are becoming very short and there are quite a lot of them.",
        "uk": "Функції стають дуже короткими і їх стає доволі багато."
      },
      {
        "en": "Hindley-Milner type signature. Using it allows to search for existing functions (ex. https://hoogle.haskell.org/). Also it helps to analyze function from the math PoV.",
        "uk": "Сигнатура типу Хіндлі-Мілнера. Її використання дозволяє знаходити існуючі функції (наприклад https://hoogle.haskell.org/). Також вона допомагає аналізувати функцію з точки зору математики."
      },
      {
        "en": "What takes me some time to get used to is definitely the reading of application code bottom to top and right to left.",
        "uk": "До чого мені важко звикнути, так це до читання коду програми знизу вгору та справа наліво."
      },
      {
        "en": "For a person that have been writing in imperative style for quite a long time at the first read the imperative style is still much more readable. But I understand that with all the helper classes and functions predefined in a library the code becomes much smaller and for a person experienced in functional programming it becomes more readable.",
        "uk": "Для людини, яка вже досить довго пише в імперативному стилі, при першому прочитанні імперативний стиль все ще набагато читабельніший. Але я розумію, що з усіма допоміжними класами та функціями, попередньо визначеними в бібліотеці, код стає набагато меншим, а для досвідченого у функціональному програмуванні розробника більш читабельним."
      }
    ],
    "categories": [
      {
        "en": "JS",
        "uk": "JS"
      },
      {
        "en": "Functional programming",
        "uk": "Functional programming"
      }
    ]
  },
  {
    "kind": "book",
    "status": "paused",
    "title": {
      "en": "You Don't Know JS (1st and 2nd editions)",
      "uk": "You Don't Know JS (1st and 2nd editions)"
    },
    "access": "free",
    "link": "https://github.com/getify/You-Dont-Know-JS",
    "thoughts": [
      {
        "en": "Sometimes come as too opinionated but is a great read to improve grasp on JS. I've put the read on a pause but I definitely recommend these and plan to read all of them myself. What I like about these, that they are not the usual quick intro books but a thorough study of the topics.",
        "uk": "Іноді здаються надто упередженими, але це чудові книги для покращення розуміння JS. Поки поставила читання цих книжок на паузу, але точно раджу до читання і сама планую прочитати всі ці книги. Це не звичний швидкий вступ у мову, а ретельне опрацювання тем."
      }
    ],
    "categories": [
      {
        "en": "JS",
        "uk": "JS"
      }
    ]
  },
  {
    "kind": "book",
    "status": "first-read",
    "title": {
      "en": "Functional-Light JavaScript",
      "uk": "Functional-Light JavaScript"
    },
    "access": "free",
    "link": "https://github.com/getify/Functional-Light-JS/blob/master/manuscript/README.md",
    "thoughts": [
      {
        "en": "Maybe it's a side effect of this book being my second knowledge source about FP but too much too often I hear in my head \"No, that can't be right. This contradicts with what I've read previously\".",
        "uk": "Можливо, це побічний ефект того, що ця книга стала моїм другим джерелом знань про FP, але занадто часто в голові я чую: \"Ні, це не може бути правдою. Це суперечить тому, що я читала у попередній книзі\"."
      },
      {
        "en": "Revisits JS function basics. (arguments, parameters, default parameters, counting parameters, counting arguments, spread/gather, destructuring, named arguments, early returns, modified outer scope, modified argument by reference, closure, anonymous functions, arrow functions, this) and other JS structures (const, Object.freeze)",
        "uk": "Повторює основи JS-функцій. (arguments, parameters, default parameters, counting parameters, counting arguments, spread/gather, destructuring, named arguments, early returns, modified outer scope, modified argument by reference, closure, anonymous functions, arrow functions, this) and other JS structures (const, Object.freeze)"
      },
      {
        "en": "Dives into following terms: Arity, Unary functions, Binary functions, N-ary functions, higher-order function, partial application, currying, point-free style, Composition, side effect, side cause, idempotence, pure function, memoization, value immutability, constant, recursion, mutual recursion, call stack, memory pressure, tail call, continuation passing style, trampolines, mapping, functor, filtering, predicate function, folding, fusion, eager vs. lazy operation, reactive FP, observable, transducing, monad",
        "uk": "Заглиблюється в наступні терміни: Arity, Unary functions, Binary functions, N-ary functions, higher-order function, partial application, currying, point-free style, Composition, side effect, side cause, idempotence, pure function, memoization, value immutability, constant, recursion, mutual recursion, call stack, memory pressure, tail call, continuation passing style, trampolines, mapping, functor, filtering, predicate function, folding, fusion, eager vs. lazy operation, reactive FP, observable, transducing, monad"
      },
      {
        "en": "Explains utilities: identity, constant, apply/unapply, partial, partialRight, curry, uncurry, curryProps, partialProps, compose, pipe, prop, setProp, objOf, Immutable.js, flatten, zip, merge, invoker, Transducers.js, ...",
        "uk": "Пояснює утиліти: identity, constant, apply/unapply, partial, partialRight, curry, uncurry, curryProps, partialProps, compose, pipe, prop, setProp, objOf, Immutable.js, flatten, zip, merge, invoker, Transducers.js, ..."
      },
      {
        "en": "The author always spends extra time to describe with code what is going on inside the new structures.",
        "uk": "Автор завжди приділяє додатковий час, щоб описати за допомогою коду те, що відбувається всередині нових структур."
      },
      {
        "en": "The author explains using math the role of function in FP, the idempotence.",
        "uk": "Автор пояснює за допомоги математики визначення ролі функції в FP, idempotence."
      },
      {
        "en": "The explanation of side effects seems different from the professor Frisby's guide. Especially, I dislike with the idea that accessing outside constants and calling other functions are not side effects.",
        "uk": "Пояснення побічних ефектів відрізняється від professor Frisby's guide. Особливо мені не подобається ідея, що доступ до зовнішніх констант та виклик інших функцій не є побічними ефектами."
      },
      {
        "en": "Muses idea of similarities between closure and object.",
        "uk": "Обмірковує ідею подібності між замиканням та об'єктом."
      },
      {
        "en": "The topic of Functor is barely touched in this book.",
        "uk": "Ця книга лише трохи описує Functor."
      },
      {
        "en": "The book is loyal to the promise of its preface that it is not a good book for diving into the topic of FP. It confuses me about FP more than helps. To little of FP ideas to much of author's opinions. At the moment, I see this book as useful not for an overview of FP, but for diving into discussion of individual features of JS, FP and programming.",
        "uk": "Книга вірна обіцянці своєї передмови, що це не найкраща книга для заглиблення в тему FP. Вона більше заплутує мене щодо FP, ніж допомагає. Замало ідей FP, водночас забагато упереджень автора. Наразі я бачу цю книгу корисною не для огляду FP, а для занурення в обговорення окремих особливостей JS, FP та програмування."
      }
    ],
    "categories": [
      {
        "en": "JS",
        "uk": "JS"
      },
      {
        "en": "Functional programming",
        "uk": "Functional programming"
      }
    ]
  },
  {
    "kind": "book",
    "status": "in-progress-first-read",
    "title": {
      "en": "Python for Data Analysis (3rd edition)",
      "uk": "Python for Data Analysis (3rd edition)"
    },
    "access": "free",
    "link": "https://wesmckinney.com/book/",
    "thoughts": [
      {
        "en": "Wonderful introduction book into Python libraries used in Data Analysis.",
        "uk": "Чудова вступна книга про бібліотеки Python, що використовуються в аналізі даних."
      },
      {
        "en": "Namely, the book gets reader acquainted with following popular libraries: Numpy, Pandas, matplotlib, seaborn.",
        "uk": "Зокрема, книга знайомить читача з такими популярними бібліотеками як: Numpy, Pandas, matplotlib, seaborn."
      },
      {
        "en": "Book is split by data analysis concerns. First chapters cover Python basics that are used further in the book. Libraries are gradually introduced and new functionality is backed by code examples.",
        "uk": "Книга розділена за аспектами аналізу даних. У перших розділах розглядаються основи Python, які використовуються далі в книзі. Бібліотеки вводяться поступово, а нові функції підкріплюються прикладами коду."
      },
      {
        "en": "As a supporting knowledge to this book I'd like to read some materials about Data Analysis itself sans coding, about real world problems and existing patterns, about underlying causes for decisions made.",
        "uk": "Як доповнення до цієї книги я хотіла б прочитати якісь матеріали про сам аналіз даних без акценту на створення коду, про реальні проблеми та існуючі шаблони, про основні причини прийнятих рішень."
      },
      {
        "en": "read in progress...",
        "uk": "продовжую читати..."
      }
    ],
    "categories": [
      {
        "en": "Python",
        "uk": "Python"
      },
      {
        "en": "Data analysis",
        "uk": "Data analysis"
      },
      {
        "en": "NumPy",
        "uk": "NumPy"
      },
      {
        "en": "Pandas",
        "uk": "Pandas"
      },
      {
        "en": "matplotlib",
        "uk": "matplotlib"
      }
    ]
  },
  {
    "kind": "book",
    "status": "planned",
    "title": {
      "en": "Structure and Interpretation of Computer Programs",
      "uk": "Structure and Interpretation of Computer Programs"
    },
    "access": "free",
    "link": "https://web.mit.edu/6.001/6.037/sicp.pdf"
  }
];
