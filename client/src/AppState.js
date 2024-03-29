import { reactive } from 'vue'

// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  user: {},
  /** @type {import('./models/Account.js').Account} */
  account: {},
  /** @type {import('./models/Project.js').Project[]} */
  projects: [],
  /** @type {import('./models/Project.js').Project | null} */
  lastEditedProject: null,
  /** @type {import('./models/Project.js').Project | null} */
  project: null,
  /** @type {import('./models/Sprint.js').Sprint[]} */
  sprints: [],
  /** @type {import('./models/Sprint.js').Sprint} */
  activeSprint: null,
  /** @type {import('./models/Task.js').Task[]} */
  tasks: [],
  /** @type {import('./models/Task.js').Task | null} */
  activeTask: null,
  /** @type {import('./models/Note.js').Note[]} */
  notes: [],
})
