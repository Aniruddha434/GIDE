import { Achievement } from '../components/Achievement';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_code',
    title: 'First Steps',
    description: 'Run your first piece of code',
    icon: '🚀',
  },
  {
    id: 'python_master',
    title: 'Python Master',
    description: 'Run 1 Python programs successfully',
    icon: '🐍',
  },
  {
    id: 'javascript_master',
    title: 'JavaScript Master',
    description: 'Run 1 JavaScript programs successfully',
    icon: '📜',
  },
  {
    id: 'file_saver',
    title: 'File Saver',
    description: 'Save your first file',
    icon: '💾',
  },
  {
    id: 'theme_switcher',
    title: 'Theme Explorer',
    description: 'Switch between light and dark themes',
    icon: '🎨',
  },
  {
    id: 'code_artist',
    title: 'Code Artist',
    description: 'Write a program with more than 50 lines of code',
    icon: '🎨',
  },
  {
    id: 'folder_creator',
    title: 'Organizer',
    description: 'Create your first folder',
    icon: '📁',
  },
  {
    id: 'playground_explorer',
    title: 'Playground Explorer',
    description: 'Try out a code playground',
    icon: '🎮',
  },
  {
    id: 'anny_helper',
    title: 'Anny\'s Friend',
    description: 'Ask Anny for help',
    icon: '🤖',
  },
  {
    id: 'multi_file',
    title: 'Multi-tasker',
    description: 'Work with multiple files open',
    icon: '📑',
  },
  {
    id: 'error_fixer',
    title: 'Bug Hunter',
    description: 'Fix your first error',
    icon: '🔍',
  },
  {
    id: 'code_cleaner',
    title: 'Code Cleaner',
    description: 'Delete a file you created',
    icon: '🧹',
  },
  {
    id: 'language_switcher',
    title: 'Language Explorer',
    description: 'Try both Python and JavaScript',
    icon: '🌍',
  },
  {
    id: 'guide_reader',
    title: 'Guide Reader',
    description: 'Read the guide section',
    icon: '📚',
  },
  {
    id: 'achievement_collector',
    title: 'Achievement Collector',
    description: 'Unlock 5 achievements',
    icon: '🏆',
  },
  {
    id: 'code_warrior',
    title: 'Code Warrior',
    description: 'Run 10 programs successfully',
    icon: '⚔️',
  },
  {
    id: 'python_ninja',
    title: 'Python Ninja',
    description: 'Run 5 Python programs successfully',
    icon: '🥷',
  },
  {
    id: 'javascript_samurai',
    title: 'JavaScript Samurai',
    description: 'Run 5 JavaScript programs successfully',
    icon: '🗡️',
  },
  {
    id: 'project_master',
    title: 'Project Master',
    description: 'Create a project with 3 or more files',
    icon: '📦',
  },
  {
    id: 'code_architect',
    title: 'Code Architect',
    description: 'Write a program with more than 100 lines',
    icon: '🏗️',
  },
  {
    id: 'debug_master',
    title: 'Debug Master',
    description: 'Fix 5 different errors',
    icon: '🔧',
  },
  {
    id: 'anny_expert',
    title: 'Anny Expert',
    description: 'Ask Anny for help 5 times',
    icon: '🤖',
  },
  {
    id: 'playground_master',
    title: 'Playground Master',
    description: 'Try all available playgrounds',
    icon: '🎯',
  },
  {
    id: 'theme_artist',
    title: 'Theme Artist',
    description: 'Switch themes 5 times',
    icon: '🎭',
  },
  {
    id: 'achievement_master',
    title: 'Achievement Master',
    description: 'Unlock 10 achievements',
    icon: '👑',
  }
];

class AchievementManager {
  private static instance: AchievementManager;
  private unlockedAchievements: Set<string>;
  private onAchievementUnlocked: ((achievement: Achievement) => void) | null = null;
  private notificationQueue: Achievement[] = [];
  private isProcessingQueue: boolean = false;

  private constructor() {
    this.unlockedAchievements = new Set(
      JSON.parse(localStorage.getItem('achievements') || '[]')
    );
  }

  public static getInstance(): AchievementManager {
    if (!AchievementManager.instance) {
      AchievementManager.instance = new AchievementManager();
    }
    return AchievementManager.instance;
  }

  public setAchievementCallback(callback: (achievement: Achievement) => void) {
    this.onAchievementUnlocked = callback;
  }

  public checkAchievement(id: string): boolean {
    return this.unlockedAchievements.has(id);
  }

  private processQueue() {
    if (this.isProcessingQueue || this.notificationQueue.length === 0) return;

    this.isProcessingQueue = true;
    const achievement = this.notificationQueue[0];
    if (!achievement) {
      this.isProcessingQueue = false;
      return;
    }

    if (this.onAchievementUnlocked) {
      this.onAchievementUnlocked(achievement);
    }

    // Wait for the notification to be shown and then process the next one
    setTimeout(() => {
      this.notificationQueue.shift();
      this.isProcessingQueue = false;
      this.processQueue();
    }, 3500); // 3 seconds for display + 0.5 seconds for animation
  }

  public unlockAchievement(id: string): void {
    if (!this.unlockedAchievements.has(id)) {
      const achievement = ACHIEVEMENTS.find(a => a.id === id);
      if (achievement) {
        this.unlockedAchievements.add(id);
        achievement.unlockedAt = new Date();
        localStorage.setItem('achievements', JSON.stringify([...this.unlockedAchievements]));
        
        // Add to notification queue instead of showing immediately
        this.notificationQueue.push(achievement);
        this.processQueue();
      }
    }
  }

  public getUnlockedAchievements(): Achievement[] {
    return ACHIEVEMENTS.filter(a => this.unlockedAchievements.has(a.id));
  }

  public resetAchievements(): void {
    this.unlockedAchievements.clear();
    this.notificationQueue = [];
    this.isProcessingQueue = false;
    localStorage.removeItem('achievements');
  }
}

export default AchievementManager; 