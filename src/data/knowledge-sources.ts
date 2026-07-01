import { KnowledgeSource } from '../schemas/knowledge-source.ts';

export const knowledgeSources: KnowledgeSource[] = [
  {
    "kind": "book",
    "status": "in-progress-first-read",
    "title": {
      "en": "AI Engineering",
      "uk": "AI Engineering"
    },
    "access": "paid",
    "link": "https://www.audible.com/pd/AI-Engineering-Audiobook/B0DWJ1SP94",
    "thoughts": [
      {
        "en": "So far this is an easy read with high level intro into AI topics.",
        "uk": "Читається легко. Вступ до тем штучного інтелекту."
      },
      {
        "en": "Some of the term the book defines: language model, token, tokenization, model’s vocabulary, masked language model, autoregressive language model, generative model, supervision, Self-supervised learning, model parameter, multimodal model, large multimodal model (LMM), embeddings, foundation model, prompt engineering, retrieval-augmented generation (RAG), AI engineering, human-in-the-loop, Crawl-Walk-Run, Modeling and training, quantization, Pre-training, Finetuning, prompt engineering, Dataset engineering, Inference optimization, Evaluation, Transformer, Prefill, Decode, Attention mechanism, Attention module, MLP module, sparse vs. dense model, expert, scaling extrapolation, hyperparameter, supervided finetuning, preference finetuning, demonstration data, behavior cloning, reward model, comparison data, greedy sampling, logit, temperature, logprobs, underflow problem, top-k, top-p (nucleus sampling), min-p, stopping conditions, test time compute, Semantic parsing, Constraint sampling, probabilistic, inconsistency, hallucination, ",
        "uk": "Деякі з термінів, з якими знайомить книга: language model, token, tokenization, model’s vocabulary, masked language model, autoregressive language model, generative model, supervision, Self-supervised learning, model parameter, multimodal model, large multimodal model (LMM), embeddings, foundation model, prompt engineering, retrieval-augmented generation (RAG), AI engineering, human-in-the-loop, Crawl-Walk-Run, Modeling and training, quantization, Pre-training, Finetuning, prompt engineering, Dataset engineering, Inference optimization, Evaluation, Transformer, Prefill, Decode, Attention mechanism, Attention module, MLP module, sparse vs. dense model, expert, scaling extrapolation, hyperparameter, supervided finetuning, preference finetuning, demonstration data, behavior cloning, reward model, comparison data, greedy sampling, logit, temperature, logprobs, underflow problem, top-k, top-p (nucleus sampling), min-p, stopping conditions, test time compute, Semantic parsing, Constraint sampling, probabilistic, inconsistency, hallucination, "
      },
      {
        "en": "Dives into following topics: Training data, Model architecture, Transformer architecture, Models size, calculating training price, post-training, sampling, Structured Outputs, finetuning, ",
        "uk": "Теми, які розглядаються в книзі: Training data, Model architecture, Transformer architecture, Models size, calculating training price, post-training, sampling, Structured Outputs, finetuning, "
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
        "en": "Explains utilities: identity, constant, apply/unapply, partial, partialRight, curry, uncurry, curryProps, partialProps, compose, pipe, prop, setProp, objOf, Immutable.js, flatten, zip, merge, invoker, Transducers.js",
        "uk": "Пояснює утиліти: identity, constant, apply/unapply, partial, partialRight, curry, uncurry, curryProps, partialProps, compose, pipe, prop, setProp, objOf, Immutable.js, flatten, zip, merge, invoker, Transducers.js"
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
    "kind": "documentation",
    "status": "first-read",
    "title": {
      "en": "Django overview /intro/",
      "uk": "Django overview /intro/"
    },
    "access": "free",
    "link": "https://docs.djangoproject.com/en/6.0/intro/",
    "thoughts": [
      {
        "en": "Main building blocks of django are apps. These customize behavior of the project. They can add pages, change templates, add data structures and other functionality. Popular apps are available to extend a django project.",
        "uk": "Main building blocks of django are apps. These customize behavior of the project. They can add pages, change templates, add data structures and other functionality. Popular apps are available to extend a django project."
      },
      {
        "en": "A django project has main directory containing configuration files that control folder structure, activate apps and make their urls available to the web, override their settings and add priority to their behavior (first come first serve).",
        "uk": "A django project has main directory containing configuration files that control folder structure, activate apps and make their urls available to the web, override their settings and add priority to their behavior (first come first serve)."
      },
      {
        "en": "Many of the django apps build their functionality around models. For example admin panel automatically creates forms that can be used to fill in the DB. The admin panel behavior can be configured from the model itself (ex. @admin.display) and from the admin.py file.",
        "uk": "Many of the django apps build their functionality around models. For example admin panel automatically creates forms that can be used to fill in the DB. The admin panel behavior can be configured from the model itself (ex. @admin.display) and from the admin.py file."
      },
      {
        "en": "Based on the models django can automatically generate migrations and run them.",
        "uk": "Based on the models django can automatically generate migrations and run them."
      },
      {
        "en": "Django provides both ASGI and WSGI entry points.",
        "uk": "Django provides both ASGI and WSGI entry points."
      },
      {
        "en": "Django uses views to process user calls to urls and provide responses.",
        "uk": "Django uses views to process user calls to urls and provide responses."
      },
      {
        "en": "Django uses templates to configure a view response.",
        "uk": "Django uses templates to configure a view response."
      },
      {
        "en": "Django puts all static files (css, images, etc.) into static folder of an app.",
        "uk": "Django puts all static files (css, images, etc.) into static folder of an app."
      },
      {
        "en": "Django has shortcuts for popular idioms.",
        "uk": "Django has shortcuts for popular idioms."
      },
      {
        "en": "Django has a built in solution for writing tests. Each app can have their own suit of tests.",
        "uk": "Django has a built in solution for writing tests. Each app can have their own suit of tests."
      },
      {
        "en": "Basically apps are self contained and are used as extending/overriding building blocks.",
        "uk": "Basically apps are self contained and are used as extending/overriding building blocks."
      }
    ],
    "categories": [
      {
        "en": "Python",
        "uk": "Python"
      },
      {
        "en": "Django",
        "uk": "Django"
      }
    ]
  },
  {
    "kind": "documentation",
    "status": "first-read",
    "title": {
      "en": "Django topics /http/",
      "uk": "Django topics /http/"
    },
    "access": "free",
    "link": "https://docs.djangoproject.com/en/6.0/topics/http/",
    "thoughts": [
      {
        "en": "This section covers following topics: URL mapping to the execution function (view), Error handling, Views and view decorators, File upload handling, 5 shortcut functions, Middleware creation and use, Sessions, URL parsing is configured using URLconf module.",
        "uk": "This section covers following topics: URL mapping to the execution function (view), Error handling, Views and view decorators, File upload handling, 5 shortcut functions, Middleware creation and use, Sessions, URL parsing is configured using URLconf module."
      },
      {
        "en": "It maps URLs to views(at this step request method and GET/POST parameters are ignored) and provides tools for URL reversing. It allows URL namespacing (at application and application instance levels) for avoiding URL name clashes.",
        "uk": "It maps URLs to views(at this step request method and GET/POST parameters are ignored) and provides tools for URL reversing. It allows URL namespacing (at application and application instance levels) for avoiding URL name clashes."
      },
      {
        "en": "Has robust solutions for capturing values from the path: has 5 predefined converter types, allows registering custom converter types and supports value capturing using regular expressions with nested arguments. URLconf can be combined with other mappings, constructed dynamically and support i18n. Default error handling views can be configured at the top level URLconf.",
        "uk": "Has robust solutions for capturing values from the path: has 5 predefined converter types, allows registering custom converter types and supports value capturing using regular expressions with nested arguments. URLconf can be combined with other mappings, constructed dynamically and support i18n. Default error handling views can be configured at the top level URLconf."
      },
      {
        "en": "Views are functions that take a web request and return a web response.",
        "uk": "Views are functions that take a web request and return a web response."
      },
      {
        "en": "Django provides several decorators that can be applied to views to support various HTTP features. These can be used to control method types that a view accepts, caching behavior, compression and to do per-view customization of CommonMiddleware behavior.",
        "uk": "Django provides several decorators that can be applied to views to support various HTTP features. These can be used to control method types that a view accepts, caching behavior, compression and to do per-view customization of CommonMiddleware behavior."
      },
      {
        "en": "Django supports file upload. Saving file using model's FileField is quite simple. Django supports multi-file upload but only one file can be saved per one model instance. You can write custom upload handlers and override handlers globally or on a per-request basis.",
        "uk": "Django supports file upload. Saving file using model's FileField is quite simple. Django supports multi-file upload but only one file can be saved per one model instance. You can write custom upload handlers and override handlers globally or on a per-request basis."
      },
      {
        "en": "Django provides 5 shortcust for popular idioms: rendering template, redirecting to other URL, resolving URL, throwing 404 on instance not found and throwing 404 on model filter returning empty list.",
        "uk": "Django provides 5 shortcust for popular idioms: rendering template, redirecting to other URL, resolving URL, throwing 404 on instance not found and throwing 404 on model filter returning empty list."
      },
      {
        "en": "Middleware can be used for globally altering Django’s input or output. Django ships with some built-in middleware you can use right out of the box. A middleware can depend on other middleware. For instance, AuthenticationMiddleware stores the authenticated user in the session; therefore, it must run after SessionMiddleware. With current design a middleware can decide to short-circuit and return a response without ever calling its get_response. Django automatically converts exceptions raised by the view or by middleware into an appropriate HTTP response.",
        "uk": "Middleware can be used for globally altering Django’s input or output. Django ships with some built-in middleware you can use right out of the box. A middleware can depend on other middleware. For instance, AuthenticationMiddleware stores the authenticated user in the session; therefore, it must run after SessionMiddleware. With current design a middleware can decide to short-circuit and return a response without ever calling its get_response. Django automatically converts exceptions raised by the view or by middleware into an appropriate HTTP response."
      },
      {
        "en": "Django provides full support for anonymous sessions. These can be configured to be stored using DB, cache, cookies or files.",
        "uk": "Django provides full support for anonymous sessions. These can be configured to be stored using DB, cache, cookies or files."
      }
    ],
    "categories": [
      {
        "en": "Python",
        "uk": "Python"
      },
      {
        "en": "Django",
        "uk": "Django"
      }
    ]
  },
  {
    "kind": "documentation",
    "status": "first-read",
    "title": {
      "en": "Django topics /db/",
      "uk": "Django topics /db/"
    },
    "access": "free",
    "link": "https://docs.djangoproject.com/en/6.0/topics/db/",
    "thoughts": [
      {
        "en": "Django provides powerful ORM to query and modify database. Some built-in apps are written using the ORM. (probably in many third-party apps too). For example, it allows quick setup of the admin panel, authentication and migrations.",
        "uk": "Django provides powerful ORM to query and modify database. Some built-in apps are written using the ORM. (probably in many third-party apps too). For example, it allows quick setup of the admin panel, authentication and migrations."
      },
      {
        "en": "ORM covers: simple CRUD commands, setting up default query behavior (filtering, ordering), 1-1, many-1, many-many relations, aggregations/annotations, support for raw SQL queries, transactions and savepoints, use of tablespaces (not creation), fixtures, multi-DB design.",
        "uk": "ORM covers: simple CRUD commands, setting up default query behavior (filtering, ordering), 1-1, many-1, many-many relations, aggregations/annotations, support for raw SQL queries, transactions and savepoints, use of tablespaces (not creation), fixtures, multi-DB design."
      },
      {
        "en": "Important terms of the ORM: Model, Model instance methods, Meta options (abstract, app_label, base_manager_name, db_table, db_table_comment, db_tablespace, default_manager_name, default_related_name, get_latest_by, managed, order_with_respect_to, ordering, permissions, default_permissions, proxy, required_db_features, required_db_vendor, select_on_save, indexes, unique_together, constraints, verbose_name, verbose_name_plural, label, label_lower), Field, Relationship Field (ForeignKey, ManyToManyField, OneToOneField), Manager, Manager methods, QuerySet, Field lookups (prebuilt: exact, iexact, contains, icontains, in, gt, gte, lt, lte, startswith, istartswith, endswith, iendswith, range, date, year, iso_year, month, day, week, week_day, iso_week_day, quarter, time, hour, minute, second, isnull, regex, iregex), Query-related tools (Q, Prefetch, prefetch_related_objects, FilteredRelation), Aggregation functions (expressions, output_field, filter, default, **extra, AnyValue, Avg, Count, Max, Min, StdDev, Sum, Variance, StringAgg), Query Expressions, Conditional Expressions, Database Functions, Index, Constraint.",
        "uk": "Important terms of the ORM: Model, Model instance methods, Meta options (abstract, app_label, base_manager_name, db_table, db_table_comment, db_tablespace, default_manager_name, default_related_name, get_latest_by, managed, order_with_respect_to, ordering, permissions, default_permissions, proxy, required_db_features, required_db_vendor, select_on_save, indexes, unique_together, constraints, verbose_name, verbose_name_plural, label, label_lower), Field, Relationship Field (ForeignKey, ManyToManyField, OneToOneField), Manager, Manager methods, QuerySet, Field lookups (prebuilt: exact, iexact, contains, icontains, in, gt, gte, lt, lte, startswith, istartswith, endswith, iendswith, range, date, year, iso_year, month, day, week, week_day, iso_week_day, quarter, time, hour, minute, second, isnull, regex, iregex), Query-related tools (Q, Prefetch, prefetch_related_objects, FilteredRelation), Aggregation functions (expressions, output_field, filter, default, **extra, AnyValue, Avg, Count, Max, Min, StdDev, Sum, Variance, StringAgg), Query Expressions, Conditional Expressions, Database Functions, Index, Constraint."
      },
      {
        "en": "It is important to profile queries since it is not always obvious how many times DB is called or how large is the cache. Take a look at QuerySet.explain(), connection.execute_wrapper(), django-debug-toolbar.",
        "uk": "It is important to profile queries since it is not always obvious how many times DB is called or how large is the cache. Take a look at QuerySet.explain(), connection.execute_wrapper(), django-debug-toolbar."
      },
      {
        "en": "Note that some methods bypass model methods and hooks by running SQL statement instead.",
        "uk": "Note that some methods bypass model methods and hooks by running SQL statement instead."
      },
      {
        "en": "It’s difficult to intuit how the ORM will translate complex querysets into SQL queries so when in doubt, inspect the SQL with str(queryset.query) and write plenty of tests.",
        "uk": "It’s difficult to intuit how the ORM will translate complex querysets into SQL queries so when in doubt, inspect the SQL with str(queryset.query) and write plenty of tests."
      },
      {
        "en": "Django does many things automatically, for example it provides names for aggregations, setups primary keys, chooses DB connection, etc. This behavior can be overridden.",
        "uk": "Django does many things automatically, for example it provides names for aggregations, setups primary keys, chooses DB connection, etc. This behavior can be overridden."
      },
      {
        "en": "Some provided functionality is available not on all DBs. Check support for your DB. For example there is the support of complex querying options for postgres only.",
        "uk": "Some provided functionality is available not on all DBs. Check support for your DB. For example there is the support of complex querying options for postgres only."
      },
      {
        "en": "Django allows setting up table level functionality (using Managers) and instance level functionality (using Models).",
        "uk": "Django allows setting up table level functionality (using Managers) and instance level functionality (using Models)."
      },
      {
        "en": "Django has functionality for generating fixtures to pre-populate the database with data for tests or to provide some initial data using the loaddata command.",
        "uk": "Django has functionality for generating fixtures to pre-populate the database with data for tests or to provide some initial data using the loaddata command."
      }
    ],
    "categories": [
      {
        "en": "Python",
        "uk": "Python"
      },
      {
        "en": "Django",
        "uk": "Django"
      }
    ]
  },
  {
    "kind": "documentation",
    "status": "first-read",
    "title": {
      "en": "Django topics /migrations/",
      "uk": "Django topics /migrations/"
    },
    "access": "free",
    "link": "https://docs.djangoproject.com/en/6.0/topics/migrations/",
    "thoughts": [
      {
        "en": "Django migrations share many core concepts with other migration systems but differ in how migrations are generated and how model history is handled.",
        "uk": "Django migrations share many core concepts with other migration systems but differ in how migrations are generated and how model history is handled."
      },
      {
        "en": "Like most migration engines, Django uses incremental migration files that describe how to transform the database schema from one version to another. These migrations are applied sequentially and represent discrete schema changes such as creating tables, adding fields, or altering columns. The migration files are part of the codebase and are intended to be version-controlled and shared across environments, similar to migrations in tools like Flyway, Liquibase, Alembic, or Rails migrations.",
        "uk": "Like most migration engines, Django uses incremental migration files that describe how to transform the database schema from one version to another. These migrations are applied sequentially and represent discrete schema changes such as creating tables, adding fields, or altering columns. The migration files are part of the codebase and are intended to be version-controlled and shared across environments, similar to migrations in tools like Flyway, Liquibase, Alembic, or Rails migrations."
      },
      {
        "en": "Where Django differs is that migrations are generated automatically from model definitions rather than written manually. Developers modify Django models and run makemigrations, which detects differences in model structure and produces migration files describing the required schema operations.",
        "uk": "Where Django differs is that migrations are generated automatically from model definitions rather than written manually. Developers modify Django models and run makemigrations, which detects differences in model structure and produces migration files describing the required schema operations."
      },
      {
        "en": "Another important distinction is that Django migrations record the full historical model state, not just the database operations. This includes changes to model and field options even when they do not affect the database schema. These changes are preserved so Django can accurately reconstruct past model states when running older migrations or performing data migrations.",
        "uk": "Another important distinction is that Django migrations record the full historical model state, not just the database operations. This includes changes to model and field options even when they do not affect the database schema. These changes are preserved so Django can accurately reconstruct past model states when running older migrations or performing data migrations."
      },
      {
        "en": "To support this, Django migrations do not import current model classes when executed. Instead, they operate on the historical model state stored in migration files. This ensures migrations remain valid even if the model code has changed significantly since the migration was created.",
        "uk": "To support this, Django migrations do not import current model classes when executed. Instead, they operate on the historical model state stored in migration files. This ensures migrations remain valid even if the model code has changed significantly since the migration was created."
      },
      {
        "en": "Django also organizes migrations per application, reflecting its modular app architecture. Each app maintains its own migrations package containing its migration files. If necessary, the location of this package can be customized using the MIGRATION_MODULES setting.",
        "uk": "Django also organizes migrations per application, reflecting its modular app architecture. Each app maintains its own migrations package containing its migration files. If necessary, the location of this package can be customized using the MIGRATION_MODULES setting."
      },
      {
        "en": "As with other migration systems, database backend capabilities affect migration behavior. PostgreSQL provides the most complete schema alteration support among Django’s supported databases. MySQL does not support transactional schema changes, so failed migrations cannot be automatically rolled back and may require manual correction. SQLite has very limited support for ALTER TABLE, so Django emulates schema changes by creating a new table with the updated schema, copying the data into it, dropping the old table, and renaming the new one. Because of this approach, SQLite is generally more suitable for development environments than production when migrations are involved.",
        "uk": "As with other migration systems, database backend capabilities affect migration behavior. PostgreSQL provides the most complete schema alteration support among Django’s supported databases. MySQL does not support transactional schema changes, so failed migrations cannot be automatically rolled back and may require manual correction. SQLite has very limited support for ALTER TABLE, so Django emulates schema changes by creating a new table with the updated schema, copying the data into it, dropping the old table, and renaming the new one. Because of this approach, SQLite is generally more suitable for development environments than production when migrations are involved."
      }
    ],
    "categories": [
      {
        "en": "Python",
        "uk": "Python"
      },
      {
        "en": "Django",
        "uk": "Django"
      }
    ]
  },
  {
    "kind": "book",
    "status": "planned",
    "title": {
      "en": "Hands-On Large Language Models",
      "uk": "Hands-On Large Language Models"
    },
    "access": "paid",
    "link": "https://www.oreilly.com/library/view/hands-on-large-language/9781098150952/"
  },
  {
    "kind": "book",
    "status": "planned",
    "title": {
      "en": "Designing Machine Learning Systems",
      "uk": "Designing Machine Learning Systems"
    },
    "access": "paid",
    "link": "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/"
  },
  {
    "kind": "book",
    "status": "planned",
    "title": {
      "en": "An Introduction to Statistical Learning",
      "uk": "An Introduction to Statistical Learning"
    },
    "access": "free",
    "link": "https://hastie.su.domains/ISLP/ISLP_website.pdf.download.html"
  },
  {
    "kind": "book",
    "status": "planned",
    "title": {
      "en": "Dive into Deep Learning",
      "uk": "Dive into Deep Learning"
    },
    "access": "free",
    "link": "https://d2l.ai/"
  },
  {
    "kind": "book",
    "status": "planned",
    "title": {
      "en": "Deep Learning with Python",
      "uk": "Deep Learning with Python"
    },
    "access": "free",
    "link": "https://deeplearningwithpython.io/chapters/"
  },
  {
    "kind": "book",
    "status": "planned",
    "title": {
      "en": "The Elements of Statistical Learning",
      "uk": "The Elements of Statistical Learning"
    },
    "access": "free",
    "link": "https://hastie.su.domains/ElemStatLearn/"
  },
  {
    "kind": "book",
    "status": "planned",
    "title": {
      "en": "Designing Data-Intensive Applications (1st edition)",
      "uk": "Designing Data-Intensive Applications (1st edition)"
    },
    "access": "paid",
    "link": "https://www.audible.com/pd/Designing-Data-Intensive-Applications-Audiobook/B08VLGDK32"
  },
  {
    "kind": "book",
    "status": "planned",
    "title": {
      "en": "Operating Systems: Three Easy Pieces",
      "uk": "Operating Systems: Three Easy Pieces"
    },
    "access": "free",
    "link": "https://pages.cs.wisc.edu/~remzi/OSTEP/"
  },
  {
    "kind": "book",
    "status": "planned",
    "title": {
      "en": "Security Engineering (3rd Edition)",
      "uk": "Security Engineering (3rd Edition)"
    },
    "access": "free",
    "link": "https://www.cl.cam.ac.uk/archive/rja14/book.html"
  },
  {
    "kind": "book",
    "status": "planned",
    "title": {
      "en": "Site Reliability Engineering",
      "uk": "Site Reliability Engineering"
    },
    "access": "free",
    "link": "https://sre.google/sre-book/table-of-contents/"
  },
  {
    "kind": "book",
    "status": "planned",
    "title": {
      "en": "The Art of Unix Programming",
      "uk": "The Art of Unix Programming"
    },
    "access": "free",
    "link": "http://www.catb.org/~esr/writings/taoup/html/"
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
  },
  {
    "kind": "book",
    "status": "planned",
    "title": {
      "en": "Game Programming Patterns",
      "uk": "Game Programming Patterns"
    },
    "access": "free",
    "link": "https://gameprogrammingpatterns.com/contents.html"
  },
  {
    "kind": "book",
    "status": "planned",
    "title": {
      "en": "Eloquent JavaScript",
      "uk": "Eloquent JavaScript"
    },
    "access": "free",
    "link": "https://eloquentjavascript.net/"
  },
  {
    "kind": "book",
    "status": "planned",
    "title": {
      "en": "Fundamentals of Software Architecture (1st edition)",
      "uk": "Fundamentals of Software Architecture (1st edition)"
    },
    "access": "paid",
    "link": "https://www.audible.com/pd/Fundamentals-of-Software-Architecture-Audiobook/B08X917VLR"
  },
  {
    "kind": "book",
    "status": "planned",
    "title": {
      "en": "Distributed systems for fun and profit",
      "uk": "Distributed systems for fun and profit"
    },
    "access": "free",
    "link": "https://book.mixu.net/distsys/ebook.html"
  }
];
