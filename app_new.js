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
            
            // Questions will be loaded from questions.json
            this.questions = [];
            this.questionData = null;
            
            // Scoring system properties
            this.userAnswers = [];
            this.sumValueWeight = {};
            this.sumWeight = {};
            
            // Trait abbreviation mapping
            this.traitAbbrToFull = {
                'H-H': 'Honesty-Humility',
                'Em': 'Emotionality', 
                'Ex': 'Extraversion',
                'Ag': 'Agreeableness',
                'Co': 'Conscientiousness',
                'Op': 'Openness',
                'Do': 'Dominance',
                'Vi': 'Vigilance',
                'ST': 'Self-Transcendence',
                'C/A': 'Abstract Orientation',
                'L/V': 'Value Orientation',
                'S/F': 'Flexibility'
            };
            
            // Value mapping for question choices
            this.valueMap = {
                'Very Low': 1,
                'Low': 2,
                'Low-Moderate': 2.5,
                'Moderate': 3,
                'High': 4,
                'Very High': 5
            };
            
            // Adjustment mapping for correlations
            this.adjustmentMap = {
                '+': 0.5,
                '+m': 0.25,
                '0': 0.0,
                '-m': -0.25,
                '-': -0.5
            };
            
            // Weights for scoring
            this.W_d = 39.0;  // Direct weight
            this.W_c = 0.085; // Correlation weight
            
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
                description: "The quiet genius who speaks through actions rather than words, Ferb is brilliantly inventive and supremely capable.",
                analysis: "Ferb shows exceptional technical competence with moderate social engagement and high creative problem-solving.",
                scores: {
                    "Honesty-Humility": 0.894,
                    "Emotionality": 0.731,
                    "Extraversion": 0.556,
                    "Agreeableness": 0.869,
                    "Conscientiousness": 0.944,
                    "Openness": 0.981,
                    "Dominance": 0.444,
                    "Vigilance": 0.594,
                    "Self-Transcendence": 0.819,
                    "Abstract Orientation": 0.994,
                    "Value Orientation": 0.744,
                    "Flexibility": 0.756
                }
            },
            {
                id: "candace-flynn",
                name: "Candace Flynn",
                show: "Phineas and Ferb",
                description: "The determined older sister with a complex mix of responsibility and teenage drama, Candace oscillates between caring and exasperation.",
                analysis: "Candace exhibits high Emotionality and Vigilance, with notable swings in Agreeableness depending on context.",
                scores: {
                    "Honesty-Humility": 0.669,
                    "Emotionality": 0.931,
                    "Extraversion": 0.781,
                    "Agreeableness": 0.456,
                    "Conscientiousness": 0.669,
                    "Openness": 0.644,
                    "Dominance": 0.744,
                    "Vigilance": 0.894,
                    "Self-Transcendence": 0.531,
                    "Abstract Orientation": 0.419,
                    "Value Orientation": 0.756,
                    "Flexibility": 0.356
                }
            },
            {
                id: "perry-platypus",
                name: "Perry the Platypus",
                show: "Phineas and Ferb",
                description: "The secret agent who leads a double life as both beloved pet and skilled spy, Perry balances multiple identities with professional competence.",
                analysis: "Perry demonstrates exceptional strategic thinking and adaptability while maintaining strong loyalty bonds.",
                scores: {
                    "Honesty-Humility": 0.781,
                    "Emotionality": 0.394,
                    "Extraversion": 0.419,
                    "Agreeableness": 0.744,
                    "Conscientiousness": 0.931,
                    "Openness": 0.819,
                    "Dominance": 0.781,
                    "Vigilance": 0.944,
                    "Self-Transcendence": 0.856,
                    "Abstract Orientation": 0.781,
                    "Value Orientation": 0.894,
                    "Flexibility": 0.919
                }
            },
            {
                id: "dr-doofenshmirtz",
                name: "Dr. Heinz Doofenshmirtz",
                show: "Phineas and Ferb",
                description: "The well-meaning but incompetent evil scientist whose elaborate schemes are driven more by childhood trauma than genuine malice.",
                analysis: "Doofenshmirtz shows high creativity and persistence but low practical competence, with notable emotional vulnerability.",
                scores: {
                    "Honesty-Humility": 0.594,
                    "Emotionality": 0.856,
                    "Extraversion": 0.719,
                    "Agreeableness": 0.631,
                    "Conscientiousness": 0.431,
                    "Openness": 0.894,
                    "Dominance": 0.669,
                    "Vigilance": 0.731,
                    "Self-Transcendence": 0.456,
                    "Abstract Orientation": 0.819,
                    "Value Orientation": 0.694,
                    "Flexibility": 0.594
                }
            }
        ];

        async init() {
            // Load questions from JSON file
            await this.loadQuestions();
            
            // Initialize scoring
            this.initializeScoring();
            
            // Ensure DOM is ready
            if (document.readyState !== 'loading') {
                this.setup();
            } else {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            }
        }
        
        async loadQuestions() {
            try {
                const response = await fetch('./questions.json');
                this.questionData = await response.json();
                this.questions = this.questionData.questions || [];
                
                // Update traits from JSON if available
                if (this.questionData.traits) {
                    this.traits = this.questionData.traits;
                }
                
                console.log(`Loaded ${this.questions.length} questions`);
            } catch (error) {
                console.error('Error loading questions:', error);
                // Fallback to a basic question set if loading fails
                this.questions = [];
            }
        }
        
        initializeScoring() {
            // Initialize weighted averaging accumulators
            this.traits.forEach(trait => {
                this.sumValueWeight[trait] = 0.0;
                this.sumWeight[trait] = 0.0;
            });
        }

        setup() {
            this.bindEvents();
            this.initializeTheme();
            this.showScreen('welcome');
        }

        bindEvents() {
            // Theme toggle
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', () => this.toggleTheme());
            }

            // Start assessment button
            const startBtn = document.getElementById('startAssessment');
            if (startBtn) {
                startBtn.addEventListener('click', () => this.startAssessment());
            }

            // Navigation buttons
            const nextBtn = document.getElementById('nextQuestion');
            const prevBtn = document.getElementById('prevQuestion');
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.nextQuestion());
            }
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => this.prevQuestion());
            }

            // Results actions
            const retakeBtn = document.getElementById('retakeAssessment');
            const saveBtn = document.getElementById('saveResults');
            
            if (retakeBtn) {
                retakeBtn.addEventListener('click', () => this.retakeAssessment());
            }
            
            if (saveBtn) {
                saveBtn.addEventListener('click', () => this.saveResults());
            }
        }

        initializeTheme() {
            // Load saved theme preference
            const savedTheme = localStorage.getItem('personalityAssessmentTheme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            this.updateThemeIcon(savedTheme);
        }

        toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('personalityAssessmentTheme', newTheme);
            this.updateThemeIcon(newTheme);
        }

        updateThemeIcon(theme) {
            const themeIcon = document.querySelector('.theme-icon');
            if (themeIcon) {
                themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
            }
        }

        showScreen(screenName) {
            console.log(`Showing screen: ${screenName}`);
            
            // Hide all screens
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('screen--active');
            });

            // Show target screen
            const targetScreen = document.getElementById(screenName);
            if (targetScreen) {
                targetScreen.classList.add('screen--active');
                this.currentScreen = screenName;

                // Handle screen-specific setup
                if (screenName === 'assessment') {
                    this.renderCurrentQuestion();
                } else if (screenName === 'results') {
                    this.renderResults();
                }
            }
        }

        startAssessment() {
            console.log('Starting assessment...');
            this.currentQuestionIndex = 0;
            this.responses = [];
            this.userAnswers = [];
            this.initializeScoring();
            this.showScreen('assessment');
        }

        renderCurrentQuestion() {
            if (this.questions.length === 0) {
                console.error('No questions available');
                return;
            }
            
            const question = this.questions[this.currentQuestionIndex];
            console.log('Rendering question:', question);

            // Update question text
            const questionElement = document.querySelector('.assessment__question');
            if (questionElement) {
                questionElement.textContent = question.text;
            }

            // Update progress
            const progressPercent = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
            const progressBar = document.querySelector('.progress__bar');
            const progressText = document.querySelector('.progress__text');
            
            if (progressBar) {
                progressBar.style.width = `${progressPercent}%`;
            }
            
            if (progressText) {
                progressText.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
            }

            // Render choices
            this.renderQuestionChoices(question);
            
            // Update navigation buttons
            this.updateNavigationButtons();
        }

        renderQuestionChoices(question) {
            const choicesContainer = document.querySelector('.choices');
            if (!choicesContainer) return;

            choicesContainer.innerHTML = '';

            question.choices.forEach((choice, index) => {
                const choiceElement = document.createElement('button');
                choiceElement.className = 'choice';
                choiceElement.textContent = choice.text;
                choiceElement.dataset.choiceIndex = index;
                
                choiceElement.addEventListener('click', () => {
                    this.selectChoice(index, choice);
                });

                choicesContainer.appendChild(choiceElement);
            });

            // Restore previous selection if any
            const savedResponse = this.responses.find(r => r.questionIndex === this.currentQuestionIndex);
            if (savedResponse) {
                const choiceElement = choicesContainer.children[savedResponse.choiceIndex];
                if (choiceElement) {
                    choiceElement.classList.add('choice--selected');
                }
            }
        }

        selectChoice(choiceIndex, choice) {
            console.log('Selected choice:', choice);

            // Update UI
            document.querySelectorAll('.choice').forEach((btn, index) => {
                btn.classList.toggle('choice--selected', index === choiceIndex);
            });

            // Store response
            const question = this.questions[this.currentQuestionIndex];
            const existingResponseIndex = this.responses.findIndex(r => r.questionIndex === this.currentQuestionIndex);
            
            const response = {
                questionIndex: this.currentQuestionIndex,
                questionId: question.id,
                choiceIndex: choiceIndex,
                choice: choice,
                question: question
            };

            if (existingResponseIndex >= 0) {
                this.responses[existingResponseIndex] = response;
            } else {
                this.responses.push(response);
            }

            // Process the answer for scoring
            this.processAnswer(question, choice);

            // Update navigation
            this.updateNavigationButtons();

            // Auto-advance if not on last question
            const hasResponse = this.responses.some(r => r.questionIndex === this.currentQuestionIndex);
            if (this.currentQuestionIndex === this.questions.length - 1 && hasResponse) {
                // Enable complete button or auto-complete
                setTimeout(() => this.completeAssessment(), 500);
            }
        }
        
        processAnswer(question, choice) {
            // Extract primary trait from category
            const primaryTrait = question.category.split(':')[0].trim();
            
            // Get the score value for this choice
            const score = this.valueMap[choice.value] || 3;
            
            // Add direct contribution
            if (this.sumValueWeight[primaryTrait] !== undefined) {
                this.sumValueWeight[primaryTrait] += score * this.W_d;
                this.sumWeight[primaryTrait] += this.W_d;
            }
            
            // Process correlations
            if (choice.correlations) {
                Object.entries(choice.correlations).forEach(([abbr, symbol]) => {
                    const fullTrait = this.traitAbbrToFull[abbr];
                    if (fullTrait && this.traits.includes(fullTrait)) {
                        const adjustment = this.adjustmentMap[symbol] || 0.0;
                        const deviation = score - 3; // 3 is neutral
                        const correlatedScore = 3 + (deviation * adjustment * 2);
                        
                        this.sumValueWeight[fullTrait] += correlatedScore * this.W_c;
                        this.sumWeight[fullTrait] += this.W_c;
                    }
                });
            }
        }

        updateNavigationButtons() {
            const nextBtn = document.getElementById('nextQuestion');
            const prevBtn = document.getElementById('prevQuestion');
            
            if (prevBtn) {
                prevBtn.style.display = this.currentQuestionIndex > 0 ? 'block' : 'none';
            }
            
            if (nextBtn) {
                const hasResponse = this.responses.some(r => r.questionIndex === this.currentQuestionIndex);
                nextBtn.disabled = !hasResponse;
                
                if (this.currentQuestionIndex === this.questions.length - 1) {
                    nextBtn.textContent = 'Complete Assessment';
                } else {
                    nextBtn.textContent = 'Next Question';
                }
            }
        }

        nextQuestion() {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
                this.renderCurrentQuestion();
            } else {
                this.completeAssessment();
            }
        }

        prevQuestion() {
            if (this.currentQuestionIndex > 0) {
                this.currentQuestionIndex--;
                this.renderCurrentQuestion();
            }
        }

        completeAssessment() {
            console.log('Completing assessment...');
            this.calculateScores();
            this.findCharacterMatches();
            this.showScreen('results');
        }

        calculateScores() {
            console.log('Calculating scores...');
            
            // Calculate base scores using weighted averaging
            this.userScores = {};
            
            this.traits.forEach(trait => {
                if (this.sumWeight[trait] > 0) {
                    // Calculate weighted average (1-5 scale)
                    const avgScore = this.sumValueWeight[trait] / this.sumWeight[trait];
                    // Convert to 0-1 scale
                    let normalizedScore = (avgScore - 1) / 4.0;
                    // Clamp between 0.1 and 0.9
                    normalizedScore = Math.max(0.1, Math.min(0.9, normalizedScore));
                    this.userScores[trait] = normalizedScore;
                } else {
                    // Set to neutral value if no contributions
                    this.userScores[trait] = 0.5;
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
            
            const avgDistance = Math.sqrt(totalDistance / validTraits);
            return Math.max(0, 1 - avgDistance); // Convert distance to similarity (0-1)
        }

        renderResults() {
            console.log('Rendering results...');
            this.renderTraitScores();
            this.renderCharacterMatches();
            this.renderRadarChart();
        }

        renderTraitScores() {
            const traitsContainer = document.querySelector('.traits');
            if (!traitsContainer) return;

            traitsContainer.innerHTML = '';

            this.traits.forEach(trait => {
                const score = this.userScores[trait] || 0;
                const percentage = Math.round(score * 100);
                
                const traitElement = document.createElement('div');
                traitElement.className = 'trait';
                traitElement.innerHTML = `
                    <div class="trait__header">
                        <span class="trait__name">${trait}</span>
                        <span class="trait__score">${percentage}%</span>
                    </div>
                    <div class="trait__bar">
                        <div class="trait__fill" style="width: ${percentage}%"></div>
                    </div>
                `;
                
                traitsContainer.appendChild(traitElement);
            });
        }

        renderCharacterMatches() {
            const matchesContainer = document.querySelector('.character-matches');
            if (!matchesContainer || this.characterMatches.length === 0) return;

            matchesContainer.innerHTML = '';

            // Show top 3 matches
            this.characterMatches.slice(0, 3).forEach((character, index) => {
                const percentage = Math.round(character.similarity * 100);
                
                const characterElement = document.createElement('div');
                characterElement.className = 'character-match';
                characterElement.innerHTML = `
                    <div class="character-match__rank">#${index + 1}</div>
                    <div class="character-match__content">
                        <h3 class="character-match__name">${character.name}</h3>
                        <p class="character-match__show">${character.show}</p>
                        <p class="character-match__description">${character.description}</p>
                        <div class="character-match__similarity">
                            <span class="character-match__percentage">${percentage}% match</span>
                            <div class="character-match__bar">
                                <div class="character-match__fill" style="width: ${percentage}%"></div>
                            </div>
                        </div>
                    </div>
                `;
                
                matchesContainer.appendChild(characterElement);
            });
        }

        renderRadarChart() {
            // For now, just show a placeholder. In a full implementation,
            // you could integrate Chart.js or another charting library
            const chartContainer = document.querySelector('.radar-chart');
            if (chartContainer) {
                chartContainer.innerHTML = '<p>Radar chart visualization would go here</p>';
            }
        }

        retakeAssessment() {
            this.currentQuestionIndex = 0;
            this.responses = [];
            this.userAnswers = [];
            this.userScores = {};
            this.characterMatches = [];
            this.initializeScoring();
            this.showScreen('welcome');
        }

        saveResults() {
            const results = {
                scores: this.userScores,
                characterMatches: this.characterMatches,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('personalityAssessmentResults', JSON.stringify(results));
            
            // Show feedback
            const saveBtn = document.getElementById('saveResults');
            if (saveBtn) {
                const originalText = saveBtn.textContent;
                saveBtn.textContent = 'Saved!';
                setTimeout(() => {
                    saveBtn.textContent = originalText;
                }, 2000);
            }
        }
    };

    // Auto-initialize when script loads
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new PersonalityApp();
    });
})();
