import React, { useState } from 'react';
import styles from './CreativeTools.module.css';

interface CreativeToolsProps {
  onSelectTemplate: (template: string) => void;
}

const CreativeTools: React.FC<CreativeToolsProps> = ({ 
  onSelectTemplate
}) => {
  const [_activeTab, _setActiveTab] = useState<'animations' | 'music' | 'drawing' | 'stories'>('animations');

  const _templates = {
    animations: [
      {
        title: "Bouncing Ball",
        description: "Create a simple bouncing ball animation using ASCII art. Learn about animation loops and basic physics!",
        code: `# Bouncing Ball Animation
import time
import os
import sys

def clear_screen():
    # Clear screen command based on OS
    os.system('cls' if os.name == 'nt' else 'clear')

def draw_ball(position, width=40, height=20):
    # Create a simple ASCII art ball animation
    ball = "O"
    screen = [[' ' for _ in range(width)] for _ in range(height)]
    
    # Calculate ball position
    x = int((position[0] + 1) * (width - 1) / 2)
    y = int((position[1] + 1) * (height - 1) / 2)
    
    # Ensure ball stays within bounds
    x = max(0, min(width - 1, x))
    y = max(0, min(height - 1, y))
    
    # Place ball
    screen[y][x] = ball
    
    # Draw screen
    print('\\n'.join([''.join(row) for row in screen]))

def animate_ball():
    try:
        # Initial position and velocity
        pos = [0, 0]  # x, y position (-1 to 1)
        vel = [0.1, 0.1]  # x, y velocity
        
        print("Bouncing Ball Animation")
        print("Animation will run for 5 seconds...")
        
        # Set a timeout for the animation
        start_time = time.time()
        timeout = 5  # seconds
        
        while time.time() - start_time < timeout:
            # Update position
            pos[0] += vel[0]
            pos[1] += vel[1]
            
            # Bounce off walls
            if abs(pos[0]) >= 1:
                vel[0] *= -1
                pos[0] = 1 if pos[0] > 0 else -1
            if abs(pos[1]) >= 1:
                vel[1] *= -1
                pos[1] = 1 if pos[1] > 0 else -1
            
            # Clear screen and draw
            clear_screen()
            draw_ball(pos)
            
            # Show remaining time
            remaining = timeout - (time.time() - start_time)
            print(f"\\nTime remaining: {remaining:.1f} seconds")
            
            # Control animation speed
            time.sleep(0.1)
            
    except Exception as e:
        print(f"Error in animation: {e}")
    finally:
        print("\\nAnimation ended")

if __name__ == "__main__":
    animate_ball()`,
        language: "python",
        difficulty: "Beginner"
      },
      {
        title: "Rainbow Circle",
        description: "Create a rotating rainbow pattern using ASCII art. Learn about colors, animation, and patterns!",
        code: `# Rainbow Circle Animation
import time
import os
import math

def clear_screen():
    # Clear screen command based on OS
    os.system('cls' if os.name == 'nt' else 'clear')

def get_rainbow_char(angle):
    # Simple rainbow characters
    chars = ".,-~:;=!*#$@"
    index = int((math.sin(angle) + 1) * (len(chars) - 1) / 2)
    return chars[index]

def draw_rainbow_circle(angle, size=20):
    # Create a simple ASCII art circle
    screen = []
    center = size // 2
    
    for y in range(size):
        row = []
        for x in range(size):
            # Calculate distance from center
            dx = x - center
            dy = y - center
            distance = math.sqrt(dx*dx + dy*dy)
            
            # Draw circle with rainbow effect
            if abs(distance - center * 0.8) < 1:
                row.append(get_rainbow_char(angle + math.atan2(dy, dx)))
            else:
                row.append(' ')
        screen.append(''.join(row))
    
    return '\\n'.join(screen)

def animate_rainbow():
    try:
        angle = 0
        print("Rainbow Circle Animation")
        print("Animation will run for 5 seconds...")
        
        # Set a timeout for the animation
        start_time = time.time()
        timeout = 5  # seconds
        
        while time.time() - start_time < timeout:
            # Clear screen and draw
            clear_screen()
            print(draw_rainbow_circle(angle))
            
            # Show remaining time
            remaining = timeout - (time.time() - start_time)
            print(f"\\nTime remaining: {remaining:.1f} seconds")
            
            # Update angle
            angle += 0.2
            if angle >= 2 * math.pi:
                angle = 0
            
            # Control animation speed
            time.sleep(0.1)
            
    except Exception as e:
        print(f"Error in animation: {e}")
    finally:
        print("\\nAnimation ended")

if __name__ == "__main__":
    animate_rainbow()`,
        language: "python",
        difficulty: "Intermediate"
      }
    ],
    music: [
      {
        title: "Simple Piano",
        description: "Create a virtual piano that plays notes and can play songs! Learn about sound, music theory, and event handling.",
        code: `# Simple Piano Player
import pygame
import time
import sys

def initialize_pygame():
    try:
        pygame.mixer.init()
        print("Pygame mixer initialized successfully!")
    except Exception as e:
        print(f"Error initializing pygame mixer: {e}")
        sys.exit(1)

def play_note(note, duration=0.5):
    try:
        # For demonstration, we'll print the note instead of playing sound
        # In a real implementation, you would use pygame.mixer.Sound
        print(f"Playing note: {note}")
        time.sleep(duration)
    except Exception as e:
        print(f"Error playing note {note}: {e}")

def play_song(song_name, notes):
    print(f"\\nPlaying {song_name}...")
    try:
        for note in notes:
            play_note(note, 0.3)  # Shorter duration for faster playback
            time.sleep(0.1)  # Small pause between notes
    except Exception as e:
        print(f"Error playing song: {e}")
    print("\\nSong finished!")

def main():
    try:
        # Initialize pygame
        initialize_pygame()
        
        # Define some simple songs
        twinkle_twinkle = ['C', 'C', 'G', 'G', 'A', 'A', 'G', 'F', 'F', 'E', 'E', 'D', 'D', 'C']
        happy_birthday = ['C', 'C', 'D', 'C', 'F', 'E', 'C', 'C', 'D', 'C', 'G', 'F']
        
        # Play Twinkle Twinkle Little Star
        play_song("Twinkle Twinkle Little Star", twinkle_twinkle)
        
        # Wait a moment
        time.sleep(1)
        
        # Play Happy Birthday
        play_song("Happy Birthday", happy_birthday)
        
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Clean up
        try:
            pygame.mixer.quit()
        except:
            pass

if __name__ == "__main__":
    main()`,
        language: "python",
        difficulty: "Intermediate"
      }
    ],
    drawing: [
      {
        title: "Fractal Tree",
        description: "Draw a fractal tree pattern using ASCII art. Learn about recursion and patterns in nature!",
        code: `# Fractal Tree Drawing
import math

def draw_tree(size, angle=0, depth=0, max_depth=5):
    if depth >= max_depth:
        return []
    
    # Calculate branch positions
    branch_length = size * 0.8
    left_angle = angle + math.pi/4
    right_angle = angle - math.pi/4
    
    # Create the current branch
    current = []
    for i in range(size):
        x = int(i * math.cos(angle))
        y = int(i * math.sin(angle))
        if 0 <= y < len(current):
            current[y] = current[y][:x] + '|' + current[y][x+1:]
        else:
            current.append(' ' * (x + 1))
            current[y] = current[y][:x] + '|' + current[y][x+1:]
    
    # Recursively draw left and right branches
    left = draw_tree(branch_length, left_angle, depth + 1, max_depth)
    right = draw_tree(branch_length, right_angle, depth + 1, max_depth)
    
    # Combine all branches
    result = []
    max_width = max(len(line) for line in current + left + right)
    
    # Pad all lines to same width
    current = [line.ljust(max_width) for line in current]
    left = [line.ljust(max_width) for line in left]
    right = [line.ljust(max_width) for line in right]
    
    # Combine branches
    for i in range(max(len(current), len(left), len(right))):
        line = ''
        if i < len(current):
            line += current[i]
        else:
            line += ' ' * max_width
        if i < len(left):
            line += left[i]
        if i < len(right):
            line += right[i]
        result.append(line)
    
    return result

def main():
    try:
        print("Fractal Tree Drawing")
        print("Drawing tree...\\n")
        
        # Draw the tree with a smaller size for better visibility
        tree = draw_tree(8, math.pi/2, max_depth=4)  # Reduced size and depth
        
        # Print the tree
        for line in tree:
            print(line)
            
        print("\\nTree drawing complete!")
        
    except Exception as e:
        print(f"Error drawing tree: {e}")

if __name__ == "__main__":
    main()`,
        language: "python",
        difficulty: "Advanced"
      }
    ],
    stories: [
      {
        title: "Interactive Story",
        description: "Create an interactive story where the reader makes choices that affect the outcome. Learn about user input, decision trees, and storytelling!",
        code: `# Interactive Story Adventure
import time
import sys

def print_slow(text, delay=0.03):
    """Print text slowly for dramatic effect"""
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    print()

def get_choice(options):
    """Get user choice from a list of options"""
    while True:
        try:
            print("\\nYour options:")
            for i, option in enumerate(options, 1):
                print(f"{i}. {option}")
            
            choice = input("\\nEnter your choice (number): ").strip()
            if not choice:
                print("Please enter a choice!")
                continue
                
            choice_num = int(choice)
            if 1 <= choice_num <= len(options):
                return options[choice_num - 1]
            else:
                print(f"Please enter a number between 1 and {len(options)}")
        except ValueError:
            print("Please enter a valid number!")
        except Exception as e:
            print(f"An error occurred: {e}")
            return options[0]  # Default to first option on error

def start_story():
    try:
        print_slow("Welcome to the Magical Forest Adventure!")
        print_slow("You find yourself standing at a crossroad in an enchanted forest...")
        
        # First choice
        choice = get_choice(["Go LEFT towards the glowing mushrooms", "Go RIGHT towards the mysterious cave"])
        
        if "LEFT" in choice:
            print_slow("\\nYou discover a friendly dragon sleeping near the glowing mushrooms!")
            dragon_choice = get_choice(["Talk to the dragon", "Try to sneak past"])
            
            if "Talk" in dragon_choice:
                print_slow("\\nThe dragon wakes up and smiles! It becomes your friend and gives you a magical gem that glows in the dark.")
            else:
                print_slow("\\nYou successfully sneak past and find a treasure chest full of gold coins!")
                
        else:  # RIGHT choice
            print_slow("\\nYou enter the mysterious cave...")
            cave_choice = get_choice(["Explore deeper into the cave", "Look around the entrance"])
            
            if "deeper" in cave_choice:
                print_slow("\\nYou discover an ancient treasure room full of magical artifacts!")
            else:
                print_slow("\\nYou find a map that leads to a hidden treasure!")
        
        print_slow("\\nThanks for playing! The End.")
        
    except Exception as e:
        print(f"\\nAn error occurred during the story: {e}")
        print("The story had to end unexpectedly. Try again!")

if __name__ == "__main__":
    try:
        start_story()
    except KeyboardInterrupt:
        print("\\n\\nStory interrupted by user. Thanks for playing!")
    except Exception as e:
        print(f"\\nAn unexpected error occurred: {e}")
    finally:
        print("\\nGame Over!")`,
        language: "python",
        difficulty: "Beginner"
      }
    ]
  };

  return (
    <div className={styles.creativeToolsContainer}>
      <div className={styles.toolsHeader}>
        <h2>Creative Tools</h2>
      </div>
      
      <div className={styles.templatesGrid}>
        <button
          className={styles.templateCard}
          onClick={() => onSelectTemplate('draw_circle')}
        >
          <span className={styles.templateIcon}>⭕</span>
          <span className={styles.templateName}>Draw Circle</span>
        </button>
        <button
          className={styles.templateCard}
          onClick={() => onSelectTemplate('draw_square')}
        >
          <span className={styles.templateIcon}>⬛</span>
          <span className={styles.templateName}>Draw Square</span>
        </button>
        <button
          className={styles.templateCard}
          onClick={() => onSelectTemplate('draw_triangle')}
        >
          <span className={styles.templateIcon}>▲</span>
          <span className={styles.templateName}>Draw Triangle</span>
        </button>
        <button
          className={styles.templateCard}
          onClick={() => onSelectTemplate('draw_star')}
        >
          <span className={styles.templateIcon}>⭐</span>
          <span className={styles.templateName}>Draw Star</span>
        </button>
      </div>
    </div>
  );
};

export default CreativeTools; 