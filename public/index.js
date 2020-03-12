$(document).ready(function() {
  const initCarousel = () => {
    $(".carousel").carousel({
      padding: 10,
      indicators: true,
      // noWrap: true,
      dist: 0,
      numVisible: 3,
      shift: 10
    });
  };

  const init = async () => {
    const plans = await axios.get("/api/plans");

    const plan = plans.data.data[1];
    console.log("🥥 plnas", plan);

    const cardHTML = `
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
            <h6>Exercise</h6>
            <div class="exercise-item">
              <p>50 Tricep Dips <span>15</span> Min</p>
            </div>
            <div class="exercise-item">
              <p>30 Pushups <span>10</span> Min</p>
            </div>
          </div>
        </div>
    </div>`;

    $(".carousel").append(cardHTML);
    initCarousel();
  };

  const addPlanBtnHandler = async e => {
    e.preventDefault();
    console.log("clicked");

    const planName = $("#planName").val();
    const duration = $("#duration").val();
    const description = $("#description").val();

    console.log(planName, duration, description);

    const plans = await axios.post("/api/plans", {
      planName,
      duration,
      description
    });
    console.log("🍒", plans);
  };

  $("form").submit(addPlanBtnHandler);
  init();
});
