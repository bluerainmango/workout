$(document).ready(function () {
  init();

  //! Init function
  async function init() {
    //* 1. Render page
    await renderCarousel();
    await renderGoals();

    //* 2. Add event handlers
    $("#form--plan").submit(addPlanBtnHandler);
    $("#form--exercise").submit(addExerciseHandler);
    $(`[type="checkbox"]`).change(progressChecker);

    //* 3. Init modal
    $(".modal").modal({ preventScrolling: true });
  }

  //! Render carousel
  async function renderCarousel() {
    //* 1. Get plans from DB
    const result = await axios.get("/api/plans");
    const plans = result.data.data;

    //* 2. Create Carousel HTML
    const cardsHTML = plans.reduce((acc, plan) => {
      // 2.1 Create Excercise HTML
      const exerciseHTML = plan.exercise.reduce(
        (acc, workout) =>
          acc +
          `<p>
            <span>${workout.exerciseName || ""} (${
            workout.duration || ""
          } min)</span>
          </p>`,
        ""
      );

      // 2.2 Create Card HTML
      const cardTemplate = `
            <div class="carousel-item" id="${plan.id}">
                <div class="card">
                  <div class="card-content">
                    <span class="card-title">${plan.planName}</span>
                    <p>
                      ${plan.description}
                    </p>
                  </div>
                  <div class="card-action">
                    <p class="duration">Duration(min): <span>${
                      plan.duration || ""
                    }</span></p>
                    <a class="btn-floating halfway-fab waves-effect waves-light deep-purple lighten-2 modal-trigger" href="#modal1""><i class="material-icons">add</i></a>
                  </div>
                  <div class="card-action exercise">
                   ${exerciseHTML}
                  </div>
                  ${plan.exercise.length > 0 ? renderSetGoalBtn() : ""}
                </div>
            </div>`;

      return acc + cardTemplate;
    }, "");

    //* 3. Add carousel HTML to DOM
    $(".carousel").empty().append(cardsHTML);

    //* 4. Init carousel
    initCarousel();

    //* 5. Add set goal BTN event handler
    $(".setGoalBtn").click(setGoalHandler);
  }

  //! BTN Event Handler(add a plan)
  async function addPlanBtnHandler(e) {
    e.preventDefault();

    //* 1. Get input values
    const planName = $("#planName").val();
    const duration = $("#duration").val();
    const description = $("#description").val();

    //* 2. Add new plan to DB
    await axios.post("/api/plans", {
      planName,
      duration,
      description,
    });

    //* 3. Rerender carousel
    await renderCarousel(true);

    //* 4. Execute carousel animation
    cardAnimation();

    $("input,textarea,label").val("").removeClass("active valid");

    //* 5. Scroll down in Mobile
    scrollDown();
  }

  //! Scroll down function
  function scrollDown() {
    if (window.innerWidth <= 800) {
      console.log("🍉 scroll");
      window.scrollTo(window.scrollX, window.scrollY + 300);
    }
  }

  //! BTN Event Handler(add a exercise)
  async function addExerciseHandler(e) {
    e.preventDefault();

    // 1. Get values
    const exerciseName = $("#exerciseName").val();
    const exerciseDuration = $("#exerciseDuration").val();

    // 2. Get plan's id to add an exercise to
    const id = $(".carousel-item.active").attr("id");

    // 3. Create new exercise to DB
    await axios.post("/api/exercises", {
      exerciseName,
      duration: exerciseDuration,
      plan: id,
    });

    // 4. Add new exercise HTML & animation to the plan DOM
    const exerciseDOM = $(`#${id} .exercise`);
    exerciseDOM
      .append(
        `<p>
        <span>${exerciseName || ""} ${
          exerciseDuration ? "(" + exerciseDuration + "min)" : ""
        }</span>
      </p>`
      )
      .children()
      .last()
      .find("span")
      .css({ animation: "newlyAdded2 .6s" });

    // 5. Add set goal BTN if it doesn't exist
    if ($(`#${id} .setGoalBtn`).length === 0) {
      renderSetGoalBtn(exerciseDOM);
      $(`#${id} .setGoalBtn`).click(setGoalHandler);
    }

    // 6. Delete values and close modal
    $("#exerciseName").empty();
    $("#exerciseDuration").empty();
    $(".modal").modal("close");
  }

  //! Render 'Set Goal' BTN
  function renderSetGoalBtn(addBtnAfterThis) {
    const setGoalBtnHTML = `<div class="card-action setGoalBtn">
       <a class="waves-effect waves-light btn-small deep-purple darken-1">
        <i class="material-icons right">flag</i>
        Set goal
       </a>
     </div>`;

    // If addBtnAfterThis is not given, just return HTML
    if (!addBtnAfterThis) return setGoalBtnHTML;

    // addBtnAfterThis : jQuery obj
    addBtnAfterThis.after(setGoalBtnHTML);
  }

  //! Render all goals list(Progress checking list)
  async function renderGoals() {
    //* 1. Get all goals from DB
    const result = await axios.get("/api/goals");
    const goals = result.data.data;

    //* 2. Create HTML(all goals)
    const goalsHTML = goals.reduce((acc, goal) => {
      const goalHTML = oneGoalListHTML(goal);

      return acc + goalHTML;
    }, "");

    //* 3. Add all goals to DOM
    $(".goals").prepend(goalsHTML);
  }

  //! Render today's new goal
  async function setGoalHandler(e) {
    console.log("🍒 add a new goal btn clicked!");
    e.preventDefault();

    //* 1. Get the clicked plan's id from DOM
    const planId = $(".carousel-item.active").attr("id");

    //* 2. Create a new goal to DB
    const result = await axios.post("/api/goals", { plan: planId });
    const newGoal = result.data.data;

    //* 3. Create a new goal list HTML(+ exercise checkboxes) and prepend it to DOM
    const goalHTML = oneGoalListHTML(newGoal);
    console.log("🐰", newGoal);

    //* 4. Add a new goal to DOM
    $(".goals")
      .prepend(goalHTML)
      .children()
      .eq(0)
      .css({ animation: "newlyAdded .6s" });

    //* 5. Add event handler
    $(`[type="checkbox"]`).change(progressChecker);

    //* 6. Scroll down in Mobile
    scrollDown();
  }

  //! Create HTML(one goal)
  function oneGoalListHTML(goalObj) {
    const {
      plan: { exercise },
      progress,
    } = goalObj;

    //* Combine exercise and progress into one obj
    const ultimateProgress = progress.map((el, i) => {
      const workoutObj = exercise.filter((workout) => {
        return el.exerciseId === workout.id;
      });

      return {
        exerciseName: workoutObj[0].exerciseName,
        duration: workoutObj[0].duration,
        ...el,
      };
    });

    // console.log("🐻", goalObj, ultimateProgress);

    //* Create checkboxes for exercise
    const exercisesHTML = ultimateProgress.reduce((acc, el) => {
      return (
        acc +
        `<div class="goal-item-checkbox">
          <label for="${el["_id"]}">
            <input id="${el["_id"]}" type="checkbox" ${
          el.isCompleted ? "checked" : ""
        }/>
            <span>${el.exerciseName || ""} (${el.duration || ""} min)</span>
          </label>
        </div>`
      );
    }, "");

    const addedDate = new Date(goalObj.createdAt).toDateString();

    //* Return HTML (goal list including exercise checkbox)
    return `<li class="collection-item goal-item" id="${goalObj._id}">
              <p class="goal-date">${addedDate}</p>
              <span class="goal-planName">${goalObj.plan.planName}</span>
              <span id="isAccomplished" style="background: ${
                goalObj.isAccomplished ? "green" : "orangered"
              }">
                ${goalObj.isAccomplished ? "Accomplished" : "Incomplete"}
              </span>
              ${exercisesHTML}
          </li>`;
  }

  //! Goal progress checker
  async function progressChecker(e) {
    const clickedProgressId = e.target.id;
    const isChecked = e.target.checked;

    console.log(
      "🐨 clicked progress id: ",
      clickedProgressId,
      "checked:",
      isChecked
    );

    const result = await axios.patch(
      `/api/goals/subDocId/${clickedProgressId}/isChecked/${isChecked}`
    );
    const { isAccomplished } = result.data.data;

    renderProgressResult(clickedProgressId, isAccomplished);
  }

  //! Rendering Accomplished or Incomplete mark
  function renderProgressResult(progressId, isAccomplished) {
    const word = isAccomplished ? "Accomplished" : "Incomplete";
    const color = isAccomplished ? "green" : "orangered";

    $(`#${progressId}`)
      .closest("li")
      .find("#isAccomplished")
      .text(word)
      .css("background", color);
  }

  //! Init carousel(Materialize)
  function initCarousel() {
    $(".carousel").carousel({
      padding: 10,
      //   indicators: true,
      noWrap: false,
      dist: 0,
      numVisible: 3,
      shift: 10,
    });

    $(".carousel").carousel("next");
  }

  //! Add carousel's card animation(when adding a new plan card)
  function cardAnimation() {
    $(".carousel-item:first .card").css({
      //   transition: "transform 1s cubic-bezier(0,1.68,1,1.43)",
      animation: "newlyAdded 1s",
    });
  }
});
