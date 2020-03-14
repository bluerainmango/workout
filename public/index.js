$(document).ready(function() {
  const setGoalBtn = `<div class="card-action setGoalBtn">
    <a class="waves-effect waves-light btn-small deep-purple darken-1"><i class="material-icons right">flag</i>Set goal</a>
  </div>`;

  init();

  async function init() {
    // 1. Render carousel
    await renderCarousel();

    // 2. Add event handlers
    $("#form--plan").submit(addPlanBtnHandler);
    $("#form--exercise").submit(addExerciseHandler);
    $("#setGoalBtn").click(setGoalHandler);

    // 3. Init modal
    $(".modal").modal({ preventScrolling: true });
  }

  async function setGoalHandler(e) {
    e.preventDefault();
  }
  async function addPlanBtnHandler(e) {
    e.preventDefault();

    // 1. Get values
    const planName = $("#planName").val();
    const duration = $("#duration").val();
    const description = $("#description").val();

    // 2. Add new plan to DB
    await axios.post("/api/plans", {
      planName,
      duration,
      description
    });

    // 3. Rerender carousel
    await renderCarousel(true);

    // 4. Execute carousel animation
    cardAnimation();

    $("input,textarea,label")
      .val("")
      .removeClass("active valid");
  }

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
      plan: id
    });

    // 4. Add new exercise HTML & animation to the plan DOM
    const exerciseDOM = $(`#${id} .exercise`);
    exerciseDOM
      .append(
        `<label>
          <input type="checkbox" class="exercise-item" />
          <span>${exerciseName || ""} (${exerciseDuration || ""} min)</span>
        </label>`
      )
      .children()
      .last()
      .find("span")
      .css({ animation: "newlyAdded2 .6s" });

    // 5. Add set goal BTN if it doesn't exist
    if ($(`#${id} .setGoalBtn`).length === 0) exerciseDOM.after(setGoalBtn);

    // Close modal
    $(".modal").modal("close");
  }

  async function renderCarousel() {
    // 1. Get plans from DB
    const result = await axios.get("/api/plans");
    const plans = result.data.data;

    // 2. Create Carousel HTML
    const cardsHTML = plans.reduce((acc, plan) => {
      // 2.1 Create Excercise HTML
      const exerciseHTML = plan.exercise.reduce(
        (acc, workout) =>
          acc +
          `<label>
            <input type="checkbox" class="exercise-item" />
            <span>${workout.exerciseName || ""} (${workout.duration ||
            ""} min)</span>
          </label>`,
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
                    <p class="duration">Duration(min): <span>${plan.duration ||
                      ""}</span></p>
                    <a class="btn-floating halfway-fab waves-effect waves-light deep-purple lighten-2 modal-trigger" href="#modal1""><i class="material-icons">add</i></a>
                  </div>
                  <div class="card-action exercise">
                   ${exerciseHTML}
                  </div>
                  ${plan.exercise.length > 0 ? setGoalBtn : ""}
                </div>
            </div>`;

      return acc + cardTemplate;
    }, "");

    // 3. Add carousel HTML to DOM
    $(".carousel")
      .empty()
      .append(cardsHTML);

    // 4. Init carousel
    initCarousel();
  }

  function initCarousel() {
    $(".carousel").carousel({
      padding: 10,
      //   indicators: true,
      noWrap: true,
      dist: 0,
      numVisible: 4,
      shift: 10
    });

    $(".carousel").carousel("next");
  }

  function cardAnimation() {
    $(".carousel-item:first .card").css({
      //   transition: "transform 1s cubic-bezier(0,1.68,1,1.43)",
      animation: "newlyAdded 1s"
    });
  }
});
