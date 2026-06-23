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
        "en": "While I expected usual code structure changes before starting the book. The first chapter introduced for me the idea that functional programs not \"function\"-al per se but mathematical. It was fascinating to watch how the decision to abandon function names and replace them with the usual '+' and '*' operations allowed us to simplify the call chain using the rules of algebra. But now I wonder how the style of the code comments must change with this paradigma.",
        "ua": "Хоча я очікувала звичайних змін у структурі коду, перш ніж почати читати книгу, перший розділ познайомив мене з ідеєю про те, що функціональні програми не є \"функціо\"-нальними як такі, вони є математичними. Спостерігати за тим, як рішення відмовитися від назв функцій та замінити їх на звичайні операції '+' та '*', дозволило спростити ланцюжок викликів за допомогою правил алгебри, було вкрай захопливо. Але тепер мені цікаво, наскільки стиль коментарів до коду повинен змінитися з цією парадигмою."
      }
    ]
  }
];
