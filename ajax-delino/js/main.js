$(document).ready(function() {
  const $categoryWrapper = $(".categories");
  const $wrapper = $(".food_section-info");
  const $test = $(".test");

  // const $wrapper=$('');
  let delinodata,
    itemsTop = [],
    scrolling = false,
    number=1;
  // const key='2a54ea59-76ad-4f8b-9856-1a7bdbc22c4c';
  //const key = '48ff20a8-c1a4-4843-8826-ae0ba77f4254';
  //a5fa43c3-234d-462a-990a-9ec7ed82159f
  const key = "890d958f-9e64-4211-a2fa-d732c7a3920f"; // https://www.delino.com/restaurant/toasthouse
  $.get(`https://api.delino.com/restaurant/menu/${key}`)
    .done(result => {
      delinodata = result.categories;
      rendercategory(delinodata);
      console.log(delinodata);
      for (var i = 0; i < delinodata.length; i++) {
        renderfood(delinodata[i]);
      }
      $wrapper.find("h1").each((i, h1) => {
        const top = $(h1).offset().top;
        itemsTop.push(parseInt(top));
      });
      console.log(itemsTop);
    })
    .fail(xhr => {
      if (xhr.status == 404) {
        alert("not found");
      }
    });
  function rendercategory(data) {
    let html = "";
    if (data) {
      data.sort(function(a, b) {
        return a.index - b.index;
      });
      console.log(data);
      const itemmenue = data.map((item, i) => {
        return `
                <div class="categories__indexbox " data-cat-id="${item.id}" >
                    <a class="categories__indexbox--inner scroll" href="#${
                      item.id
                    }">
                        <img class="categories__img " src="img/${
                          item.logo
                        }.png" alt="${item.title}">
                        <b class="categories__caption">${item.title}</b>
                    </a>
                </div>
                `;
      });
      html = itemmenue.join("");
    }
    $categoryWrapper.html(html);
  }
  function renderfood(data) {
    let html =
      '<h1 style="font-size: 20px; text-align: center">' + data.title + "</h1>";
    for (var i = 0; i < data.sub.length; i++) {
      if (data.sub[i].id == 0) {
        const subdata = data.sub[i].food;
        if (subdata) {
          const itemsBox = subdata.map((item, i) => {
            let image = item.img
              ? '<img  class="food_section-category__img" src="' +
                item.img.replace("#SIZEOFIMAGE#", "280x175") +
                '"/>'
              : "";
            return `
                    <div class="food_section-category col-1-of-3" data-food='${JSON.stringify(
                      item
                    )}'>
                        <div class="food_section-img">
                            ${image}    
                        </div>
                        <div class="food_section-description">
                            <div class="food_section-description-index">
                                <h3 class="food_section-description-title">${
                                  item.title
                                }</h3>
                                <span >${helper.truncate(
                                  item.ingredient
                                )}</span>
                            </div>
                        </div>
                        <div class="food_section-last clearfix">
                            <div class="food_section-last-price">
                                ${helper.currancy(item.price)}
                            </div>
                            <div class="food_section-last-cart">
                                <a class="food_section-last-carticon" href=""><span >
                                <i class="fas fa-shopping-cart"></i></span></a>
                            </div>
                        </div>
                    </div>
                `;
          });
          html +=
            ` <div style="border: 1px solid #eee" class="food_section-infobox" id="box-${
              data.id
            }">` +
            itemsBox.join("") +
            `</div>`;
        }
      } else {
        let image = data.sub[i].img
          ? '<img  class="food_section-category__img" src="' +
            data.sub[i].img.replace("#SIZEOFIMAGE#", "280x175") +
            '"/>'
          : "";
        html += `
                <div class="food_section-category col-1-of-3" data-food-id="${
                  data.sub[i].id
                }">
                    <div class="food_section-img">
                        ${image}    
                    </div>
                    <div class="food_section-description">
                        <div class="food_section-description-index">
                            <h3 class="food_section-description-title">${
                              data.sub[i].title
                            }</h3>
                            <span >${helper.truncate(
                              data.sub[i].priceLabel
                            )}</span>
                        </div>
                    </div>
                    <div class="food_section-last clearfix">
                        <div class="food_section-last-price">
                            ${helper.currancy(data.sub[i].priceLabel || 0)}
                        </div>
                        <div class="food_section-last-cart">
                            <a class="food_section-last-carticon" href=""><span >
                            <i class="fas fa-shopping-cart"></i></span></a>
                        </div>
                    </div>
                </div>
            `;
      }
    }
    $wrapper.append(html);
  }
  function renderpopup(data) {
    console.log(data);
    console.log(data.id);
    let image = data.img
      ? '<img  class="popup__content-img--inner"" src="' +
        data.img.replace("#SIZEOFIMAGE#", "560x350") +
        '"/>'
      : ""; //560×350
    $(".test").addClass("popup").html(`
           <div class="popup__content">
                <div class="popup__content-close">
                    <img class="popup__content-close--icon" src="img/close.svg"  />
                </div>
                <div class="popup__content-img">
                    ${image}
                </div>
                <div class="popup__content-text">
                    <div class="popup__content-title">
                        ${data.title}
                    </div>
                    <div class="popup__content-ingredient">
                        ${data.ingredient}
                    </div>
                    <footer class="footerpopup">
                    <span class="popup__content-price">${helper.currancy(
                      data.price
                    )} </span>
                        <a class="popup__content-addbtn">
                            <img class="plusbtn" src="img/plus.svg" alt="plus">
                        </a>
                    </footer>
                </div>
                <div class="popup__content-holder">
                    <button class="popup__content-btn" data-modal-button="false" >افزودن به سبد خرید</button>
                </div>
            </div>
           `);

    //for style before click on plus bottom
       const $testing=$('.popup__content-btn').data("modal-button");
       function showcart(type){
         type == true ? $('.popup__content-btn').addClass('changecart') :$('.popup__content-btn').css({"background":"#d2d2d2","cursor":"default"});
       }

       $('.popup__content-addbtn').on("click",function(){
         $testing=true;
          showcart(type);
          rendercart();
      });
  }
  function rendercart(){
    $('.popup__content-addbtn').addClass('countcart').html(`
    <button class="minus_btn" data-cmd="delete" ><i class="fas fa-minus"></i></button>
      <span class="count-span" >${number}</span>
      <button class="add_btn" data-cmd="add"><i class="fas fa-plus"></i></button>
    `);
    function check(type){      
      const situation= type === 'add' ? number += 1 : number -= 1;
      console.log( situation);
      $('.count-span').text()=situation;
    }
  $('.add_btn').on("click",function(){
      check('add');
  });
  $('.minus_btn').on("click",function(){
    if(number>1){
      check('minus');
    }
  })
  }
  //popup
  $categoryWrapper.on("click", "a", function() {
    scrolling = true;
    const catId = $(this)
      .parent()
      .data("cat-id");
    actievCategory(catId);

    let itemTopIndex = 0;
    for (var i = 0; i < delinodata.length; i++) {
      if (delinodata[i].id == catId) {
        itemTopIndex = i;
        break;
      }
    }

    $("body")
      .stop()
      .animate(
        {
          scrollTop: itemsTop[itemTopIndex] - 100
        },
        600
      );
    setTimeout(() => {
      scrolling = false;
    }, 600);

    // const $box = $(
    //   "#box-" +
    //     $(this)
    //       .closest("div")
    //       .data("cat-id")
    // );
    // $(this)
    //   .closest("div")
    //   .addClass("active-box");
    // $(this)
    //   .closest("div")
    //   .siblings()
    //   .removeClass("active-box");
    // if ($box.length) {
    //   $("body")
    //     .stop()
    //     .animate(
    //       {
    //         scrollTop: $box.offset().top - 100
    //       },
    //       600
    //     );
    // }
  });

  $test.on("click", ".popup__content-close", function() {
    $(".test").removeClass("popup");
  });
  $wrapper.on("click", "img", function() {
    const itemData = $(this)
      .closest(".food_section-category")
      .data("food");
    renderpopup(itemData);
  });
  //scrollwatcher
  $(window).scroll(function() {
    if (!scrolling) {
      var scrollposition = $(window).scrollTop();
      //console.log(scrollposition);
      let activeBoxIndex = 0;
      for (var i = 0; i < itemsTop.length; i++) {
        if (scrollposition < itemsTop[i]) {
          activeBoxIndex = i;
          break;
        }
      }
      const activeBox = delinodata[activeBoxIndex];
      console.log(activeBox.id);
      actievCategory(activeBox.id);
    }
  });
  function actievCategory(id) {
    $(".categories")
      .find('div[data-cat-id="' + id + '"]')
      .addClass("active-box")
      .siblings()
      .removeClass("active-box");
  }
});
