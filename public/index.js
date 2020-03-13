$(document).ready(function() {
  $("#form--plan").submit(addPlanBtnHandler);
  $("#form--exercise").submit(addExerciseHandler);

  init();

  async function addPlanBtnHandler(e) {
    e.preventDefault();

    const planName = $("#planName").val();
    const duration = $("#duration").val();
    const description = $("#description").val();

    console.log(planName, duration, description);

    await axios.post("/api/plans", {
      planName,
      duration,
      description
    });

    const lastIndex = await renderCarousel(true);
    console.log("🍏", lastIndex);
    // $(".carousel").carousel("next", lastIndex);
    // $(".carousel").carousel("prev");
    // $(".carousel").carousel("set", lastIndex);
    // location.reload();

    cardAnimation();
  }

  async function addExerciseHandler(e) {
    e.preventDefault();

    // Get values
    const exerciseName = $("#exerciseName").val();
    const exerciseDuration = $("#exerciseDuration").val();

    // Get plan's id to add an exercise to
    const id = $(".carousel-item.active").attr("id");

    console.log(exerciseName, exerciseDuration, id);

    // Create new exercise to DB
    await axios.post("/api/exercises", {
      exerciseName,
      duration: exerciseDuration,
      plan: id
    });

    console.log($(`#${id} #exercise`));

    // Add new exercise to the plan DOM
    $(`#${id} #exercise`)
      .append(
        `<div class="exercise-item"><p>${exerciseName ||
          ""} <span>(${exerciseDuration || ""}</span> min)</p></div>`
      )
      .children()
      .last()
      .css({ animation: "newlyAdded2 .6s" });

    // Close modal
    $(".modal").modal("close");
  }

  async function init() {
    $(".modal").modal({ preventScrolling: true });
    await renderCarousel();
  }

  async function renderCarousel(isNew = false) {
    const result = await axios.get("/api/plans");
    const plans = result.data.data;

    //* Create Carousel HTML
    const cardsHTML = plans.reduce((acc, plan) => {
      // 1. Create Excercise HTML
      const exerciseHTML = plan.exercise.reduce(
        (acc, workout) =>
          acc +
          `<div class="exercise-item"><p>${workout.exerciseName ||
            ""} <span>(${workout.duration || ""}</span> min)</p></div>`,
        ""
      );

      // 2. Create Card HTML
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
                  <p class="date">Start Date: <span>${plan.starDate ||
                    ""}</span></p>
                    <p class="duration">Duration: <span>${plan.duration ||
                      ""}</span></p>
                    <a class="btn-floating halfway-fab waves-effect waves-light deep-purple lighten-3 modal-trigger" href="#modal1""><i class="material-icons">add</i></a>
                  </div>
                  <div class="card-action" id="exercise">
                   ${exerciseHTML}
                  </div>
                </div>
            </div>`;

      return acc + cardTemplate;
    }, "");

    $(".carousel")
      .empty()
      .append(cardsHTML);

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
    const newlyAdded = $(".carousel-item:first .card").css({
      //   transition: "transform 1s cubic-bezier(0,1.68,1,1.43)",
      animation: "newlyAdded 1s"
    });
  }
});
