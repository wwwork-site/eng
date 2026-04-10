(() => {
  const mount = document.getElementById("demoApp");
  if (!mount) {
    return;
  }

  const questions = [
    {
      id: "q1",
      question: "Какой вариант корректно завершает фразу: “Please send the report ___ Friday morning.”?",
      options: ["at", "by", "until", "for"],
      correctIndex: 1,
      weight: 2,
    },
    {
      id: "q2",
      question: "Какой ответ наиболее уместен в деловой переписке на запрос статуса задачи?",
      options: [
        "No idea, maybe later.",
        "We are currently finalizing the draft and will share it today.",
        "Why are you asking again?",
        "Task is maybe done I think.",
      ],
      correctIndex: 1,
      weight: 2,
    },
    {
      id: "q3",
      question: "Что лучше всего передает смысл фразы “to meet the deadline”?",
      options: ["отложить задачу", "согласовать бюджет", "уложиться в срок", "закрыть вакансию"],
      correctIndex: 2,
      weight: 1,
    },
    {
      id: "q4",
      question: "Выберите наиболее точный вариант: “The candidate has ___ experience in international sales.”",
      options: ["an", "a", "the", "no article"],
      correctIndex: 3,
      weight: 2,
    },
    {
      id: "q5",
      question: "Какой ответ показывает уверенное понимание устной инструкции на встрече?",
      options: [
        "Could you repeat every sentence? I didn't catch anything.",
        "Got it. I'll prepare the summary and share it before EOD.",
        "Maybe I can do it tomorrow or next week.",
        "I don't work with this kind of task.",
      ],
      correctIndex: 1,
      weight: 3,
    },
  ];

  const state = {
    currentIndex: 0,
    answers: Array(questions.length).fill(null),
    finished: false,
  };

  const totalWeight = questions.reduce((sum, q) => sum + q.weight, 0);

  const progress = mount.querySelector("[data-demo-progress]");
  const step = mount.querySelector("[data-demo-step]");
  const questionTitle = mount.querySelector("[data-demo-question]");
  const optionsWrap = mount.querySelector("[data-demo-options]");
  const prevButton = mount.querySelector("[data-demo-prev]");
  const nextButton = mount.querySelector("[data-demo-next]");
  const resultWrap = mount.querySelector("[data-demo-result]");
  const resultScore = mount.querySelector("[data-demo-score]");
  const resultLevel = mount.querySelector("[data-demo-level]");
  const resultSummary = mount.querySelector("[data-demo-summary]");
  const resultLead = mount.querySelector("[data-demo-lead]");
  const resultRestart = mount.querySelector("[data-demo-restart]");

  const getResult = (score) => {
    if (score >= 75) {
      return {
        score,
        level: "Уверенный рабочий уровень",
        summary:
          "Кандидат, вероятно, комфортно работает в международной коммуникации. Рекомендуется расширенная платная оценка по роли.",
        ctaHref: "contacts.html#lead",
      };
    }

    if (score >= 45) {
      return {
        score,
        level: "Рабочий базовый уровень",
        summary:
          "Есть потенциал для части задач на английском. Для финального решения стоит подключить полную диагностику навыков.",
        ctaHref: "contacts.html#lead",
      };
    }

    return {
      score,
      level: "Стартовый уровень",
      summary:
        "Для роли с международной нагрузкой риск найма повышен. Имеет смысл использовать расширенную проверку перед оффером.",
      ctaHref: "contacts.html#lead",
    };
  };

  const calculateScore = () => {
    const raw = questions.reduce((sum, q, index) => {
      if (state.answers[index] === q.correctIndex) {
        return sum + q.weight;
      }
      return sum;
    }, 0);

    return Math.round((raw / totalWeight) * 100);
  };

  const renderQuestion = () => {
    const question = questions[state.currentIndex];
    const answeredCount = state.answers.filter((answer) => answer !== null).length;
    const currentProgress = Math.round((answeredCount / questions.length) * 100);

    progress.style.width = `${currentProgress}%`;
    step.textContent = `Вопрос ${state.currentIndex + 1} из ${questions.length}`;
    questionTitle.textContent = question.question;

    optionsWrap.innerHTML = "";
    question.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "demo-option";
      button.textContent = option;

      if (state.answers[state.currentIndex] === optionIndex) {
        button.classList.add("is-selected");
      }

      button.addEventListener("click", () => {
        state.answers[state.currentIndex] = optionIndex;
        renderQuestion();
      });

      optionsWrap.appendChild(button);
    });

    prevButton.disabled = state.currentIndex === 0;
    nextButton.disabled = state.answers[state.currentIndex] === null;
    nextButton.textContent = state.currentIndex === questions.length - 1 ? "Показать результат" : "Далее";
  };

  const renderResult = () => {
    const score = calculateScore();
    const result = getResult(score);

    progress.style.width = "100%";
    step.textContent = "Результат демо";
    questionTitle.textContent = "Готово. Вот ориентировочная бизнес-оценка.";
    optionsWrap.innerHTML = "";

    resultScore.textContent = `${result.score}%`;
    resultLevel.textContent = result.level;
    resultSummary.textContent = result.summary;
    resultLead.href = result.ctaHref;

    prevButton.hidden = true;
    nextButton.hidden = true;
    resultWrap.hidden = false;
  };

  prevButton.addEventListener("click", () => {
    if (state.currentIndex > 0) {
      state.currentIndex -= 1;
      renderQuestion();
    }
  });

  nextButton.addEventListener("click", () => {
    if (state.answers[state.currentIndex] === null) {
      return;
    }

    if (state.currentIndex < questions.length - 1) {
      state.currentIndex += 1;
      renderQuestion();
      return;
    }

    state.finished = true;
    renderResult();
  });

  resultRestart.addEventListener("click", () => {
    state.currentIndex = 0;
    state.answers = Array(questions.length).fill(null);
    state.finished = false;

    prevButton.hidden = false;
    nextButton.hidden = false;
    resultWrap.hidden = true;

    renderQuestion();
  });

  renderQuestion();
})();
