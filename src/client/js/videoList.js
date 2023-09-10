const scrollableList = document.querySelector(".home-video-list");
const scrollableList2 = document.querySelector(".home-video-list2");
const scrollLeftButton = document.getElementById("scroll-left");
const scrollRightButton = document.getElementById("scroll-right");
const scrollLeftButton2= document.querySelector(".scroll-left2");
const scrollRightButton2 = document.querySelector(".scroll-right2");

console.log(scrollableList);


scrollLeftButton.addEventListener('click', function () {
    scrollableList.scrollBy({ left: -200, behavior: 'smooth' }); 
  });
  
scrollRightButton.addEventListener('click', function () {
    scrollableList.scrollBy({ left: 200, behavior: 'smooth' }); 
});

scrollLeftButton2.addEventListener('click', function () {
  scrollableList2.scrollBy({ left: -200, behavior: 'smooth' }); 
});

scrollRightButton2.addEventListener('click', function () {
  scrollableList2.scrollBy({ left: 200, behavior: 'smooth' }); 
});