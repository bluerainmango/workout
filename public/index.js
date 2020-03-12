$(document).ready(function() {
  $("form").submit(addPlanBtnHandler);
  init();

  var instance = "";

  async function addPlanBtnHandler(e) {
    e.preventDefault();
    console.log("clicked");

    const planName = $("#planName").val();
    const duration = $("#duration").val();
    const description = $("#description").val();

    console.log(planName, duration, description);

    await axios.post("/api/plans", {
      planName,
      duration,
      description
    });

    const lastIndex = await renderCarousel();
    console.log("🍏", lastIndex);
    // $(".carousel").carousel("next", lastIndex);
    // $(".carousel").carousel("prev");
    // $(".carousel").carousel("set", lastIndex);
    // location.reload();
  }

  function init() {
    renderCarousel();
  }

  async function renderCarousel() {
    const result = await axios.get("/api/plans");
    const plans = result.data.data;

    const cardsHTML = plans.reduce((acc, plan) => {
      // Create excercise HTML
      const exerciseHTML = plan.exercise.reduce(
        (acc, workout) =>
          acc +
          `<div class="exercise-item"><p>${workout.exerciseName} <span>${workout.duration}</span> Min</p></div>`,
        ""
      );

      const cardTemplate = `
            <div class="carousel-item">
                <div class="card">
                  <div class="card-content">
                    <span class="card-title">${plan.planName}</span>
                    <p>
                      ${plan.description}
                    </p>
                  </div>
                  <div class="card-action">
                    <p class="duration">Duration <span>${plan.duration} days</span></p>
                    <p class="date">Start Date <span>${plan.starDate}</span></p>
                    <a class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">add</i></a>
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

    return plans.length - 1;
  }

  function initCarousel() {
    // if (instance.el) {
    //   instance.destroy();
    // }
    $(".carousel").carousel({
      padding: 10,
      indicators: true,
      // noWrap: true,
      dist: 0,
      numVisible: 3,
      shift: 10
    });

    // ca = document.getElementsByClassName("carousel");
    // instance = M.Carousel.getInstance(ca);
  }
});
