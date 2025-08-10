// Personality Assessment Application
(function() {
    'use strict';
    
    // Global app instance
    window.PersonalityApp = class PersonalityApp {
        constructor() {
            this.currentScreen = 'welcome';
            this.currentQuestionIndex = 0;
            this.responses = [];
            this.userScores = {};
            this.characterMatches = [];
            this.charts = {};
            
            this.init();
        }

        // Personality traits definitions
        traits = [
            'Honesty-Humility', 'Emotionality', 'Extraversion', 'Agreeableness',
            'Conscientiousness', 'Openness', 'Dominance', 'Vigilance', 
            'Self-Transcendence', 'Abstract Orientation', 'Value Orientation', 'Flexibility'
        ];

        // Character data
        characters = [
            {
                id: "phineas-flynn",
                name: "Phineas Flynn",
                show: "Phineas and Ferb", 
                description: "The endlessly optimistic and wildly creative co-protagonist, Phineas is an unstoppable force of summer fun.",
                analysis: "Phineas's profile is dominated by extremely high scores in Extraversion, Openness, and Abstract Orientation.",
                scores: {
                    "Honesty-Humility": 0.831,
                    "Emotionality": 0.919,
                    "Extraversion": 0.994,
                    "Agreeableness": 0.806,
                    "Conscientiousness": 0.756,
                    "Openness": 0.996,
                    "Dominance": 0.681,
                    "Vigilance": 0.619,
                    "Self-Transcendence": 0.769,
                    "Abstract Orientation": 0.999,
                    "Value Orientation": 0.819,
                    "Flexibility": 0.881
                }
            },
            {
                id: "ferb-fletcher",
                name: "Ferb Fletcher", 
                show: "Phineas and Ferb",
                description: "The quiet genius behind many of Phineas's inventions, Ferb is incredibly skilled and thoughtful.",
                analysis: "Ferb's personality is characterized by high Conscientiousness and Abstract Orientation, making him the perfect complement to Phineas's wild creativity.",
                scores: {
                    "Honesty-Humility": 0.769,
                    "Emotionality": 0.744,
                    "Extraversion": 0.544,
                    "Agreeableness": 0.756,
                    "Conscientiousness": 0.894,
                    "Openness": 0.931,
                    "Dominance": 0.544,
                    "Vigilance": 0.556,
                    "Self-Transcendence": 0.781,
                    "Abstract Orientation": 0.996,
                    "Value Orientation": 0.856,
                    "Flexibility": 0.806
                }
            },
            {
                id: "candace-flynn",
                name: "Candace Flynn",
                show: "Phineas and Ferb",
                description: "The frustrated older sister who desperately wants to get her brothers in trouble.",
                analysis: "Candace's profile is dominated by extremely high Vigilance and Emotionality, reflecting her constant state of alertness and emotional reactivity.",
                scores: {
                    "Honesty-Humility": 0.606,
                    "Emotionality": 1.044,
                    "Extraversion": 0.831,
                    "Agreeableness": 0.656,
                    "Conscientiousness": 0.581,
                    "Openness": 0.631,
                    "Dominance": 0.706,
                    "Vigilance": 1.069,
                    "Self-Transcendence": 0.581,
                    "Abstract Orientation": 0.656,
                    "Value Orientation": 0.606,
                    "Flexibility": 0.569
                }
            },
            {
                id: "dr-doofenshmirtz", 
                name: "Dr. Doofenshmirtz",
                show: "Phineas and Ferb",
                description: "The bumbling evil scientist with a tragic backstory. Despite his villainous aspirations, Doofenshmirtz is more pathetic than threatening.",
                analysis: "Doofenshmirtz shows high Dominance and Abstract Orientation, reflecting his megalomaniacal tendencies and inventive abilities.",
                scores: {
                    "Honesty-Humility": 0.669,
                    "Emotionality": 0.756,
                    "Extraversion": 0.681,
                    "Agreeableness": 0.544,
                    "Conscientiousness": 0.644,
                    "Openness": 0.881,
                    "Dominance": 0.881,
                    "Vigilance": 0.731,
                    "Self-Transcendence": 0.619,
                    "Abstract Orientation": 0.931,
                    "Value Orientation": 0.669,
                    "Flexibility": 0.681
                }
            },
            {
                id: "perry-platypus",
                name: "Perry the Platypus",
                show: "Phineas and Ferb", 
                description: "Agent P is a secret agent who leads a double life as the Flynn-Fletcher family pet.",
                analysis: "Perry's profile shows extremely high Conscientiousness and Emotionality, reflecting his dedication to duty and ability to care deeply while maintaining professional composure.",
                scores: {
                    "Honesty-Humility": 0.931,
                    "Emotionality": 0.994,
                    "Extraversion": 0.869,
                    "Agreeableness": 0.781,
                    "Conscientiousness": 0.956,
                    "Openness": 0.556,
                    "Dominance": 0.519,
                    "Vigilance": 0.581,
                    "Self-Transcendence": 0.831,
                    "Abstract Orientation": 0.556,
                    "Value Orientation": 0.806,
                    "Flexibility": 0.731
                }
            }
        ];

        // Assessment questions
        questions = [
            {
                id: 1,
                text: "You're asked to write a recommendation for a colleague who is not very competent. What do you do?",
                trait: "Honesty-Humility",
                choices: [
                    "Write a glowing recommendation to help them get the job",
                    "Write a neutral recommendation, avoiding specifics", 
                    "Write an honest but tactful recommendation, highlighting strengths",
                    "Decline to write the recommendation, citing lack of familiarity",
                    "Write an honest recommendation, even if it might hurt their chances"
                ]
            },
            {
                id: 2, 
                text: "Waiting for important medical test results. How do you feel?",
                trait: "Emotionality",
                choices: [
                    "Completely calm, not thinking about it",
                    "Slightly uneasy but easily distracted",
                    "Moderately worried, checking for updates",
                    "Very anxious, imagining worst-case scenarios", 
                    "Consumed by panic, unable to focus"
                ]
            },
            {
                id: 3,
                text: "At a party where you don't know many people, you:",
                trait: "Extraversion",
                choices: [
                    "Stay close to the few people you know",
                    "Observe others before making any moves",
                    "Wait for others to approach you first",
                    "Strike up conversations with a few new people",
                    "Work the room, meeting as many people as possible"
                ]
            },
            {
                id: 4,
                text: "A friend asks for your honest opinion about their new haircut, which you think looks terrible:",
                trait: "Agreeableness",
                choices: [
                    "Tell them exactly what you think",
                    "Give subtle hints that it might not be their best look",
                    "Say it's different but avoid giving your opinion",
                    "Find something positive to say about it",
                    "Enthusiastically compliment it to make them happy"
                ]
            },
            {
                id: 5,
                text: "When working on a long-term project, you:",
                trait: "Conscientiousness",
                choices: [
                    "Start immediately and work consistently",
                    "Plan everything out before beginning",
                    "Work in bursts when motivated",
                    "Procrastinate but usually meet deadlines",
                    "Often need extensions or rush at the last minute"
                ]
            },
            {
                id: 6,
                text: "Your ideal weekend involves:",
                trait: "Openness",
                choices: [
                    "Sticking to familiar activities and routines",
                    "A mix of planned and spontaneous activities",
                    "Following your usual weekend schedule",
                    "Trying one new thing alongside familiar ones",
                    "Seeking out completely new experiences"
                ]
            },
            {
                id: 7,
                text: "In group decision-making, you typically:",
                trait: "Dominance",
                choices: [
                    "Go along with whatever others decide",
                    "Share your opinion if asked directly",
                    "Contribute your thoughts to the discussion",
                    "Try to guide the group toward your preferred option",
                    "Take charge and push for your solution"
                ]
            },
            {
                id: 8,
                text: "When someone seems upset but says they're fine, you:",
                trait: "Vigilance",
                choices: [
                    "Take them at their word and move on",
                    "Notice but don't push the issue",
                    "Gently ask if they want to talk",
                    "Keep checking on them throughout the day",
                    "Immediately investigate what's wrong"
                ]
            },
            {
                id: 9,
                text: "Your approach to helping others is:",
                trait: "Self-Transcendence",
                choices: [
                    "Help when directly asked",
                    "Offer help when you notice obvious needs",
                    "Regularly check if friends need support",
                    "Actively seek out ways to help others",
                    "Make helping others a central part of your life"
                ]
            },
            {
                id: 10,
                text: "When learning something new, you prefer:",
                trait: "Abstract Orientation",
                choices: [
                    "Concrete examples and practical applications",
                    "Step-by-step instructions with clear outcomes",
                    "Understanding the basic principles first",
                    "Exploring theoretical connections and implications",
                    "Diving deep into abstract concepts and possibilities"
                ]
            },
            {
                id: 11,
                text: "Your core values are most influenced by:",
                trait: "Value Orientation",
                choices: [
                    "Personal success and achievement",
                    "Family traditions and cultural heritage",
                    "Religious or spiritual beliefs",
                    "Ethical principles and moral reasoning",
                    "Universal human rights and social justice"
                ]
            },
            {
                id: 12,
                text: "When plans change unexpectedly, you:",
                trait: "Flexibility",
                choices: [
                    "Feel stressed and try to stick to original plans",
                    "Adapt reluctantly after some resistance",
                    "Adjust your plans with minor frustration",
                    "Easily go with the flow",
                    "Embrace the change as an exciting opportunity"
                ]
            },
            // Additional questions for more comprehensive assessment
            {
                id: 13,
                text: "You find out a friend has been spreading false rumors about you. You:",
                trait: "Honesty-Humility",
                choices: [
                    "Confront them aggressively and demand an explanation",
                    "Talk to mutual friends to get your side of the story out",
                    "Address it directly but calmly with your friend",
                    "Let it go, assuming it will resolve itself",
                    "Reflect on whether there's any truth to what they're saying"
                ]
            },
            {
                id: 14,
                text: "Before a big presentation, you typically feel:",
                trait: "Emotionality",
                choices: [
                    "Completely confident and excited",
                    "Slightly nervous but mostly prepared",
                    "Moderately anxious with some self-doubt",
                    "Very worried about potential mistakes",
                    "Overwhelmed with anxiety and fear"
                ]
            },
            {
                id: 15,
                text: "At work events, you usually:",
                trait: "Extraversion",
                choices: [
                    "Attend only if required and leave early",
                    "Show up, socialize briefly, then leave",
                    "Participate normally in conversations",
                    "Actively network and meet new colleagues",
                    "Become the center of attention and energize others"
                ]
            },
            {
                id: 16,
                text: "A coworker is struggling with a task you excel at. You:",
                trait: "Agreeableness",
                choices: [
                    "Let them figure it out themselves",
                    "Offer help only if they ask directly",
                    "Provide some general guidance",
                    "Offer detailed assistance and support",
                    "Take over parts of their work to help them succeed"
                ]
            },
            {
                id: 17,
                text: "Your workspace is typically:",
                trait: "Conscientiousness",
                choices: [
                    "Extremely organized with everything in its place",
                    "Mostly organized with occasional clutter",
                    "Functional but not particularly neat",
                    "Somewhat messy but you know where things are",
                    "Chaotic and disorganized"
                ]
            },
            {
                id: 18,
                text: "When choosing a vacation destination, you:",
                trait: "Openness",
                choices: [
                    "Return to familiar places you've enjoyed",
                    "Choose destinations similar to places you've liked",
                    "Mix familiar elements with some new experiences",
                    "Seek out places you've never been before",
                    "Choose the most exotic and unfamiliar destination possible"
                ]
            },
            {
                id: 19,
                text: "In team meetings, you:",
                trait: "Dominance",
                choices: [
                    "Rarely speak unless directly asked",
                    "Contribute when you have something important to add",
                    "Participate actively in discussions",
                    "Often guide the conversation and decision-making",
                    "Take control and direct the meeting's flow"
                ]
            },
            {
                id: 20,
                text: "You notice subtle changes in your friend's behavior that might indicate problems. You:",
                trait: "Vigilance",
                choices: [
                    "Don't pay much attention to small changes",
                    "Notice but assume it's temporary",
                    "Keep an eye on the situation",
                    "Actively monitor their behavior for more signs",
                    "Immediately investigate and address your concerns"
                ]
            },
            {
                id: 21,
                text: "When considering major life decisions, how important are the effects on others?",
                trait: "Self-Transcendence",
                choices: [
                    "I focus primarily on what's best for me",
                    "I consider others but prioritize my needs",
                    "I balance my needs with others' equally",
                    "I heavily weigh the impact on others",
                    "Others' wellbeing is my primary consideration"
                ]
            },
            {
                id: 22,
                text: "Your preferred type of conversation involves:",
                trait: "Abstract Orientation",
                choices: [
                    "Practical matters and daily experiences",
                    "Current events and factual topics",
                    "Ideas and concepts that interest you",
                    "Theoretical discussions and philosophical topics",
                    "Complex abstract concepts and their implications"
                ]
            },
            {
                id: 23,
                text: "Your moral decisions are primarily guided by:",
                trait: "Value Orientation",
                choices: [
                    "What benefits you personally",
                    "What your family/community would approve of",
                    "Religious or traditional teachings",
                    "Logical ethical principles",
                    "Universal ideals of justice and human dignity"
                ]
            },
            {
                id: 24,
                text: "When your routine is disrupted, you:",
                trait: "Flexibility",
                choices: [
                    "Become stressed and try to restore the routine quickly",
                    "Feel uncomfortable but manage to adapt",
                    "Adjust with some initial resistance",
                    "Adapt smoothly to the new situation",
                    "Welcome the disruption as a positive change"
                ]
            }
        ];

        init() {
            // Ensure DOM is ready
            if (document.readyState !== 'loading') {
                this.setup();
            } else {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            }
        }

        setup() {
            console.log('Setting up personality assessment app...');
            this.setupTheme();
            this.loadSavedData();
            this.bindEvents();
            console.log('App setup complete.');
        }

        bindEvents() {
            console.log('Binding events...');
            
            // Theme toggle
            this.bindButton('themeToggle', () => this.toggleTheme());
            
            // Welcome screen
            this.bindButton('startAssessment', () => this.startAssessment());
            this.bindButton('resumeAssessment', () => this.resumeAssessment());
            
            // Assessment navigation
            this.bindButton('prevQuestion', () => this.previousQuestion());
            this.bindButton('nextQuestion', () => this.nextQuestion());
            
            // Results actions
            this.bindButton('downloadResults', () => this.downloadResults());
            this.bindButton('retakeAssessment', () => this.retakeAssessment());
            this.bindButton('shareResults', () => this.shareResults());
        }

        bindButton(id, handler) {
            const element = document.getElementById(id);
            if (element) {
                console.log(`Binding event for ${id}`);
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`${id} clicked`);
                    handler();
                });
            } else {
                console.warn(`Element with id ${id} not found`);
            }
        }

        setupTheme() {
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-color-scheme', savedTheme);
            this.updateThemeIcon(savedTheme);
        }

        toggleTheme() {
            console.log('Toggle theme called');
            const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            console.log(`Switching theme from ${currentTheme} to ${newTheme}`);
            document.documentElement.setAttribute('data-color-scheme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme);
        }

        updateThemeIcon(theme) {
            const icon = document.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = theme === 'dark' ? '☀️' : '🌙';
            }
        }

        loadSavedData() {
            const savedResponses = localStorage.getItem('personalityAssessmentResponses');
            if (savedResponses) {
                const resumeButton = document.getElementById('resumeAssessment');
                if (resumeButton) {
                    resumeButton.classList.remove('hidden');
                }
            }
        }

        showScreen(screenId) {
            console.log(`Showing screen: ${screenId}`);
            
            // Hide all screens
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('screen--active');
            });
            
            // Show target screen
            const targetScreen = document.getElementById(screenId);
            if (targetScreen) {
                targetScreen.classList.add('screen--active');
                this.currentScreen = screenId;
                console.log(`Screen ${screenId} is now active`);
            } else {
                console.error(`Screen ${screenId} not found`);
            }
        }

        startAssessment() {
            console.log('Starting assessment...');
            this.currentQuestionIndex = 0;
            this.responses = [];
            localStorage.removeItem('personalityAssessmentResponses');
            this.showScreen('assessment');
            this.displayQuestion();
        }

        resumeAssessment() {
            console.log('Resuming assessment...');
            const savedResponses = localStorage.getItem('personalityAssessmentResponses');
            if (savedResponses) {
                this.responses = JSON.parse(savedResponses);
                this.currentQuestionIndex = this.responses.length;
            }
            this.showScreen('assessment');
            this.displayQuestion();
        }

        displayQuestion() {
            console.log(`Displaying question ${this.currentQuestionIndex + 1}`);
            const question = this.questions[this.currentQuestionIndex];
            if (!question) {
                console.error('Question not found');
                return;
            }
            
            const progressPercent = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
            
            // Update progress
            const progressFill = document.getElementById('progressFill');
            const progressText = document.getElementById('progressText');
            
            if (progressFill) {
                progressFill.style.width = `${progressPercent}%`;
            }
            if (progressText) {
                progressText.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
            }
            
            // Display question
            const questionText = document.getElementById('questionText');
            if (questionText) {
                questionText.textContent = question.text;
            }
            
            // Create choices
            const choicesContainer = document.getElementById('questionChoices');
            if (choicesContainer) {
                choicesContainer.innerHTML = '';
                
                question.choices.forEach((choice, index) => {
                    const choiceElement = document.createElement('div');
                    choiceElement.className = 'choice-option';
                    choiceElement.textContent = choice;
                    choiceElement.dataset.value = index + 1; // 1-5 scale
                    choiceElement.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.selectChoice(choiceElement, index + 1);
                    });
                    choicesContainer.appendChild(choiceElement);
                });
                
                // Check if we have a saved response for this question
                if (this.responses[this.currentQuestionIndex]) {
                    const savedValue = this.responses[this.currentQuestionIndex].value;
                    const choiceElement = choicesContainer.children[savedValue - 1];
                    if (choiceElement) {
                        choiceElement.classList.add('choice-option--selected');
                    }
                }
            }
            
            // Update navigation buttons
            const prevButton = document.getElementById('prevQuestion');
            if (prevButton) {
                prevButton.disabled = this.currentQuestionIndex === 0;
            }
            
            this.updateNavigationButtons();
        }

        selectChoice(element, value) {
            console.log(`Selected choice ${value}`);
            
            // Remove previous selection
            document.querySelectorAll('.choice-option').forEach(choice => {
                choice.classList.remove('choice-option--selected');
            });
            
            // Add selection to clicked element
            element.classList.add('choice-option--selected');
            
            // Save response
            const question = this.questions[this.currentQuestionIndex];
            this.responses[this.currentQuestionIndex] = {
                questionId: question.id,
                trait: question.trait,
                value: value,
                timestamp: new Date().toISOString()
            };
            
            // Save to localStorage
            localStorage.setItem('personalityAssessmentResponses', JSON.stringify(this.responses));
            
            this.updateNavigationButtons();
        }

        updateNavigationButtons() {
            const hasResponse = this.responses[this.currentQuestionIndex] !== undefined;
            const nextButton = document.getElementById('nextQuestion');
            
            if (nextButton) {
                nextButton.disabled = !hasResponse;
                
                if (this.currentQuestionIndex === this.questions.length - 1 && hasResponse) {
                    nextButton.textContent = 'Complete Assessment';
                } else {
                    nextButton.textContent = 'Next';
                }
            }
        }

        previousQuestion() {
            console.log('Going to previous question');
            if (this.currentQuestionIndex > 0) {
                this.currentQuestionIndex--;
                this.displayQuestion();
            }
        }

        nextQuestion() {
            console.log('Going to next question');
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
                this.displayQuestion();
            } else {
                this.completeAssessment();
            }
        }

        async completeAssessment() {
            console.log('Completing assessment...');
            this.showScreen('loading');
            
            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.calculateScores();
            this.findCharacterMatches();
            this.showScreen('results');
            this.displayResults();
            
            // Clear saved responses
            localStorage.removeItem('personalityAssessmentResponses');
            
            // Save final results
            const results = {
                scores: this.userScores,
                characterMatches: this.characterMatches,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('personalityAssessmentResults', JSON.stringify(results));
        }

        calculateScores() {
            console.log('Calculating scores...');
            // Initialize scores
            this.userScores = {};
            this.traits.forEach(trait => {
                this.userScores[trait] = 0;
            });
            
            // Calculate trait scores
            const traitCounts = {};
            this.traits.forEach(trait => {
                traitCounts[trait] = 0;
            });
            
            this.responses.forEach(response => {
                const trait = response.trait;
                this.userScores[trait] += response.value;
                traitCounts[trait]++;
            });
            
            // Normalize scores to 0-1 scale
            this.traits.forEach(trait => {
                if (traitCounts[trait] > 0) {
                    const averageScore = this.userScores[trait] / traitCounts[trait];
                    this.userScores[trait] = (averageScore - 1) / 4; // Convert 1-5 scale to 0-1
                }
            });
            
            console.log('User scores:', this.userScores);
        }

        findCharacterMatches() {
            console.log('Finding character matches...');
            this.characterMatches = this.characters.map(character => {
                const similarity = this.calculateSimilarity(this.userScores, character.scores);
                return {
                    ...character,
                    similarity: similarity
                };
            }).sort((a, b) => b.similarity - a.similarity);
            
            console.log('Character matches:', this.characterMatches);
        }

        calculateSimilarity(userScores, characterScores) {
            let totalDistance = 0;
            let validTraits = 0;
            
            this.traits.forEach(trait => {
                if (userScores[trait] !== undefined && characterScores[trait] !== undefined) {
                    const distance = Math.abs(userScores[trait] - characterScores[trait]);
                    totalDistance += distance * distance; // Squared Euclidean distance
                    validTraits++;
                }
            });
            
            if (validTraits === 0) return 0;
            
            const averageDistance = Math.sqrt(totalDistance / validTraits);
            const similarity = Math.max(0, 1 - averageDistance); // Convert distance to similarity
            return similarity;
        }

        displayResults() {
            console.log('Displaying results...');
            this.displayPersonalityChart();
            this.displayTopTraits();
            this.displayCharacterMatches();
            this.displayBestMatch();
        }

        displayPersonalityChart() {
            const ctx = document.getElementById('personalityChart');
            if (!ctx) {
                console.error('Personality chart canvas not found');
                return;
            }
            
            if (this.charts.personality) {
                this.charts.personality.destroy();
            }
            
            const data = {
                labels: this.traits,
                datasets: [{
                    label: 'Your Scores',
                    data: this.traits.map(trait => (this.userScores[trait] * 100).toFixed(1)),
                    backgroundColor: 'rgba(31, 184, 205, 0.2)',
                    borderColor: 'rgba(31, 184, 205, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(31, 184, 205, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            };
            
            const options = {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            };
            
            this.charts.personality = new Chart(ctx, {
                type: 'radar',
                data: data,
                options: options
            });
        }

        displayTopTraits() {
            const sortedTraits = this.traits
                .map(trait => ({
                    name: trait,
                    score: this.userScores[trait],
                    description: this.getTraitDescription(trait)
                }))
                .sort((a, b) => b.score - a.score)
                .slice(0, 5);
            
            const container = document.getElementById('topTraits');
            if (!container) return;
            
            container.innerHTML = '';
            
            sortedTraits.forEach(trait => {
                const traitElement = document.createElement('div');
                traitElement.className = 'trait-item';
                traitElement.innerHTML = `
                    <div class="trait-item__info">
                        <div class="trait-item__name">${trait.name}</div>
                        <div class="trait-item__description">${trait.description}</div>
                    </div>
                    <div class="trait-item__score">${(trait.score * 100).toFixed(0)}%</div>
                `;
                container.appendChild(traitElement);
            });
        }

        displayCharacterMatches() {
            const container = document.getElementById('characterMatches');
            if (!container) return;
            
            container.innerHTML = '';
            
            this.characterMatches.forEach((character, index) => {
                const matchElement = document.createElement('div');
                matchElement.className = 'character-match';
                matchElement.innerHTML = `
                    <div class="character-match__rank">#${index + 1}</div>
                    <div class="character-match__info">
                        <div class="character-match__name">${character.name}</div>
                        <div class="character-match__show">${character.show}</div>
                        <div class="character-match__description">${character.description}</div>
                    </div>
                    <div class="character-match__similarity">${(character.similarity * 100).toFixed(0)}%</div>
                `;
                container.appendChild(matchElement);
            });
        }

        displayBestMatch() {
            const bestMatch = this.characterMatches[0];
            if (!bestMatch) return;
            
            const nameElement = document.getElementById('bestMatchName');
            const descriptionElement = document.getElementById('bestMatchDescription');
            const analysisElement = document.getElementById('bestMatchAnalysis');
            
            if (nameElement) nameElement.textContent = bestMatch.name;
            if (descriptionElement) descriptionElement.textContent = bestMatch.description;
            if (analysisElement) analysisElement.textContent = bestMatch.analysis;
            
            this.displayComparisonChart(bestMatch);
        }

        displayComparisonChart(character) {
            const ctx = document.getElementById('comparisonChart');
            if (!ctx) return;
            
            if (this.charts.comparison) {
                this.charts.comparison.destroy();
            }
            
            const data = {
                labels: this.traits,
                datasets: [
                    {
                        label: 'You',
                        data: this.traits.map(trait => (this.userScores[trait] * 100).toFixed(1)),
                        backgroundColor: 'rgba(31, 184, 205, 0.2)',
                        borderColor: 'rgba(31, 184, 205, 1)',
                        borderWidth: 2
                    },
                    {
                        label: character.name,
                        data: this.traits.map(trait => (character.scores[trait] * 100).toFixed(1)),
                        backgroundColor: 'rgba(255, 193, 133, 0.2)',
                        borderColor: 'rgba(255, 193, 133, 1)',
                        borderWidth: 2
                    }
                ]
            };
            
            const options = {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                }
            };
            
            this.charts.comparison = new Chart(ctx, {
                type: 'radar',
                data: data,
                options: options
            });
        }

        getTraitDescription(trait) {
            const descriptions = {
                'Honesty-Humility': 'Fairness, genuineness, and modesty in dealings with others',
                'Emotionality': 'Emotional sensitivity, anxiety, and attachment to others',
                'Extraversion': 'Social confidence, energy, and seeking social attention',
                'Agreeableness': 'Forgiveness, gentleness, and patience with others',
                'Conscientiousness': 'Organization, diligence, and self-discipline',
                'Openness': 'Appreciation for art, nature, and intellectual pursuits',
                'Dominance': 'Leadership, assertiveness, and desire to control situations',
                'Vigilance': 'Suspiciousness, wariness, and attention to potential threats',
                'Self-Transcendence': 'Altruism, mysticism, and concern for others\' welfare',
                'Abstract Orientation': 'Interest in ideas, philosophy, and theoretical concepts',
                'Value Orientation': 'Traditional values, moral reasoning, and ethical principles',
                'Flexibility': 'Adaptability, tolerance for change, and open-mindedness'
            };
            return descriptions[trait] || '';
        }

        downloadResults() {
            const results = {
                timestamp: new Date().toISOString(),
                personalityScores: this.userScores,
                topTraits: this.traits
                    .map(trait => ({
                        name: trait,
                        score: this.userScores[trait]
                    }))
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 5),
                characterMatches: this.characterMatches,
                bestMatch: this.characterMatches[0]
            };
            
            const dataStr = JSON.stringify(results, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `personality-assessment-results-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }

        shareResults() {
            if (!this.characterMatches || this.characterMatches.length === 0) return;
            
            const bestMatch = this.characterMatches[0];
            const shareText = `I just took a personality assessment and my closest match is ${bestMatch.name} from ${bestMatch.show} with ${(bestMatch.similarity * 100).toFixed(0)}% similarity! 🧠✨`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'My Personality Assessment Results',
                    text: shareText
                });
            } else {
                // Fallback: copy to clipboard
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareText).then(() => {
                        alert('Results copied to clipboard!');
                    });
                } else {
                    alert('Share functionality not available in this browser.');
                }
            }
        }

        retakeAssessment() {
            console.log('Retaking assessment...');
            localStorage.removeItem('personalityAssessmentResponses');
            localStorage.removeItem('personalityAssessmentResults');
            this.showScreen('welcome');
            const resumeButton = document.getElementById('resumeAssessment');
            if (resumeButton) {
                resumeButton.classList.add('hidden');
            }
        }
    };

    // Initialize the application
    let appInstance = null;
    
    function initApp() {
        console.log('Initializing personality assessment app...');
        if (!appInstance) {
            appInstance = new window.PersonalityApp();
        }
    }

    // Initialize when DOM is ready
    if (document.readyState !== 'loading') {
        initApp();
    } else {
        document.addEventListener('DOMContentLoaded', initApp);
    }

})();