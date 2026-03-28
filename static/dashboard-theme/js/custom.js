// (function () {
//   "use strict";
//   /* page loader */
  
//   // ______________ PROGRESS BAR ON SCROLL
// 	window.addEventListener('scroll', () => {
// 		var widnowScroll = document.body.scrollTop || document.documentElement.scrollTop,
// 			height = document.documentElement.scrollHeight - document.documentElement.clientHeight,
// 			scrollAmount = (widnowScroll / height) * 100;
// 		document.querySelector(".progress-top-bar").style.width = scrollAmount + "%";
// 	})

  
//   function hideLoader() {
//     const loader = document.getElementById("loader");
//     loader.classList.add("d-none")
//   }

//   window.addEventListener("load", hideLoader);
//   /* page loader */

//   /* tooltip */
//   const tooltipTriggerList = document.querySelectorAll(
//     '[data-bs-toggle="tooltip"]'
//   );
//   const tooltipList = [...tooltipTriggerList].map(
//     (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
//   );

//   /* popover  */
//   const popoverTriggerList = document.querySelectorAll(
//     '[data-bs-toggle="popover"]'
//   );
//   const popoverList = [...popoverTriggerList].map(
//     (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
//   );

//   //switcher color pickers
//   const pickrContainerPrimary = document.querySelector(
//     ".pickr-container-primary"
//   );
//   const themeContainerPrimary = document.querySelector(
//     ".theme-container-primary"
//   );
//   const pickrContainerBackground = document.querySelector(
//     ".pickr-container-background"
//   );
//   const themeContainerBackground = document.querySelector(
//     ".theme-container-background"
//   );

//   /* for theme primary */
//   const nanoThemes = [
//     [
//       "nano",
//       {
//         defaultRepresentation: "RGB",
//         components: {
//           preview: true,
//           opacity: false,
//           hue: true,

//           interaction: {
//             hex: false,
//             rgba: true,
//             hsva: false,
//             input: true,
//             clear: false,
//             save: false,
//           },
//         },
//       },
//     ],
//   ];
//   const nanoButtons = [];
//   let nanoPickr = null;
//   for (const [theme, config] of nanoThemes) {
//     const button = document.createElement("button");
//     button.innerHTML = theme;
//     nanoButtons.push(button);

//     button.addEventListener("click", () => {
//       const el = document.createElement("p");
      
//       if(pickrContainerPrimary){
//         pickrContainerPrimary.appendChild(el);
//       }

//       /* Delete previous instance */
//       if (nanoPickr) {
//         nanoPickr.destroyAndRemove();
//       }

//       /* Apply active class */
//       for (const btn of nanoButtons) {
//         btn.classList[btn === button ? "add" : "remove"]("active");
//       }

//       /* Create fresh instance */
//       nanoPickr = new Pickr(
//         Object.assign(
//           {
//             el,
//             theme,
//             default: "#845adf",
//           },
//           config
//         )
//       );

//       /* Set events */
//       nanoPickr.on("changestop", (source, instance) => {
//         let color = instance.getColor().toRGBA();
//         let html = document.querySelector("html");
//         html.style.setProperty(
//           "--primary-rgb",
//           `${Math.floor(color[0])}, ${Math.floor(color[1])}, ${Math.floor(
//             color[2]
//           )}`
//         );
//         /* theme color picker */
//         localStorage.setItem(
//           "primaryRGB",
//           `${Math.floor(color[0])}, ${Math.floor(color[1])}, ${Math.floor(
//             color[2]
//           )}`
//         );
//         updateColors();
//       });
//     });

//     // themeContainerPrimary.appendChild(button);
//     if (themeContainerPrimary) {
//       themeContainerPrimary.appendChild(button);
//     }
  
//   }
//   nanoButtons[0].click();
//   /* for theme primary */

//   /* for theme background */
//   const nanoThemes1 = [
//     [
//       "nano",
//       {
//         defaultRepresentation: "RGB",
//         components: {
//           preview: true,
//           opacity: false,
//           hue: true,

//           interaction: {
//             hex: false,
//             rgba: true,
//             hsva: false,
//             input: true,
//             clear: false,
//             save: false,
//           },
//         },
//       },
//     ],
//   ];
//   const nanoButtons1 = [];
//   let nanoPickr1 = null;
//   for (const [theme, config] of nanoThemes) {
//     const button = document.createElement("button");
//     button.innerHTML = theme;
//     nanoButtons1.push(button);

//     button.addEventListener("click", () => {
//       const el = document.createElement("p");
//       pickrContainerBackground.appendChild(el);

//       /* Delete previous instance */
//       if (nanoPickr1) {
//         nanoPickr1.destroyAndRemove();
//       }

//       /* Apply active class */
//       for (const btn of nanoButtons) {
//         btn.classList[btn === button ? "add" : "remove"]("active");
//       }

//       /* Create fresh instance */
//       nanoPickr1 = new Pickr(
//         Object.assign(
//           {
//             el,
//             theme,
//             default: "#845adf",
//           },
//           config
//         )
//       );

//       /* Set events */
//       nanoPickr1.on("changestop", (source, instance) => {
//         let color = instance.getColor().toRGBA();
//         let html = document.querySelector("html");
//         html.style.setProperty(
//           "--body-bg-rgb",
//           `${color[0]}, ${color[1]}, ${color[2]}`
//         );
//         document
//           .querySelector("html")
//           .style.setProperty(
//             "--body-bg-rgb2",
//             `${color[0] + 14}, ${color[1] + 14}, ${color[2] + 14}`
//           );
//         document
//           .querySelector("html")
//           .style.setProperty(
//             "--light-rgb",
//             `${color[0] + 14}, ${color[1] + 14}, ${color[2] + 14}`
//           );
//         document
//           .querySelector("html")
//           .style.setProperty(
//             "--form-control-bg",
//             `rgb(${color[0] + 14}, ${color[1] + 14}, ${color[2] + 14})`
//           );
//         localStorage.removeItem("bgtheme");
//         updateColors();
//         html.setAttribute("data-theme-mode", "dark");
//         html.setAttribute("data-menu-styles", "dark");
//         html.setAttribute("data-header-styles", "dark");
//         document.querySelector("#switcher-dark-theme").checked = true;
//         localStorage.setItem(
//           "bodyBgRGB",
//           `${color[0]}, ${color[1]}, ${color[2]}`
//         );
//         localStorage.setItem(
//           "bodylightRGB",
//           `${color[0] + 14}, ${color[1] + 14}, ${color[2] + 14}`
//         );
//       });
//     });
//     if(themeContainerBackground){
//       themeContainerBackground.appendChild(button);
//     }
    
//   }
//   nanoButtons1[0].click();

//   /* Choices JS */
//   document.addEventListener("DOMContentLoaded", function () {
//     var genericExamples = document.querySelectorAll("[data-trigger]");
//     for (let i = 0; i < genericExamples.length; ++i) {
//       var element = genericExamples[i];
//       new Choices(element, {
//         allowHTML: true,
//         placeholderValue: "This is a placeholder set in the config",
//         searchPlaceholderValue: "Search",
//       });
//     }
//   });
//   /* Choices JS */

//   // change password
//     function changePassword() {
//       var changePasswordBtn = document.querySelector('#changePassword');
//       var inputField = document.querySelector('#reEnterPassword');
//       var closeInputField = document.querySelector('#closePassword');

//       changePasswordBtn.addEventListener('click', () => {
//         inputField.classList.remove('d-none');
//       })
//       closeInputField.addEventListener('click', () => {
//         inputField.classList.add('d-none');
//       })
//     }
//     changePassword();
  

//   /* footer year */
//   // document.getElementById("year").innerHTML = new Date().getFullYear();
//   /* footer year */

//   /* node waves */
//   Waves.attach(".btn-wave", ["waves-light"]);
//   Waves.init();
//   /* node waves */

//   /* card with close button */
//   let DIV_CARD = ".card";
//   let cardRemoveBtn = document.querySelectorAll(
//     '[data-bs-toggle="card-remove"]'
//   );
//   cardRemoveBtn.forEach((ele) => {
//     ele.addEventListener("click", function (e) {
//       e.preventDefault();
//       let $this = this;
//       let card = $this.closest(DIV_CARD);
//       card.remove();
//       return false;
//     });
//   });
//   /* card with close button */
  
//   /*header-remove */
//   const headerbtn = document.querySelectorAll(".header-remove-btn");

//   headerbtn.forEach((button, index) => {
//     button.addEventListener("click", (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       button.parentNode.remove();
//       if (document.getElementById("allCartsContainer")) {
//         document.getElementById("cart-data").innerText = `${
//           document.getElementById("allCartsContainer").children.length
//         } Items`;
//         document.getElementById("cart-data2").innerText = `${
//           document.getElementById("allCartsContainer").children.length
//         }`;
//       }
//       if (document.getElementById("allNotifyContainer")) {
//         document.getElementById("notify-data").innerText = `${
//           document.getElementById("allNotifyContainer").children.length
//         }`;
//       }

//       if (document.getElementById("allCartsContainer")) {
//         if (document.getElementById("allCartsContainer").children.length == 0) {
//           document.getElementById("allCartsContainer").parentNode.innerHTML = `
//                         <div class="p-6 pb-8 text-center">
//                           <div>
//                             <i class="ri ri-shopping-cart-2-line leading-none text-4xl avatar avatar-lg bg-primary/20 text-primary rounded-full p-3 align-middle flex justify-center mx-auto"></i>
//                             <div class="mt-5">
//                               <p class="text-base font-semibold text-gray-800 dark:text-white mb-1">
//                                 No Items In Cart
//                               </p>
//                               <p class="text-xs text-gray-500 dark:text-white/70">
//                               When you have Items added here , they will appear here.
//                               </p>
//                               <a href="javascript:void(0);" class="m-0 ti-btn ti-btn-primary py-1 mt-5"><i class="ti ti-arrow-right text-base leading-none"></i>Continue Shopping</a>
//                             </div>
//                           </div>
//                         </div>`;
//         }
//       }
//       if (document.getElementById("allNotifyContainer")) {
//         if (
//           document.getElementById("allNotifyContainer").children.length == 0
//         ) {
//           document.getElementById("allNotifyContainer").parentNode.innerHTML = `
//           <div class="p-6 pb-8 text-center">
//           <div>
//             <i class="ri ri-notification-off-line leading-none text-4xl avatar avatar-lg bg-secondary/20 text-secondary rounded-full p-3 align-middle flex justify-center mx-auto"></i>
//             <div class="mt-5">
//               <p class="text-base font-semibold text-gray-800 dark:text-white mb-1">
//                 No Notifications Found
//               </p>
//               <p class="text-xs text-gray-500 dark:text-white/70">
//               When you have notifications added here , they will appear here.
//               </p>
//             </div>
//           </div>
//         </div>`;
//         }
//       }
//     });
//   });
//   /*header-remove */

//   /* card with fullscreen */
//   let cardFullscreenBtn = document.querySelectorAll(
//     '[data-bs-toggle="card-fullscreen"]'
//   );
//   cardFullscreenBtn.forEach((ele) => {
//     ele.addEventListener("click", function (e) {
//       let $this = this;
//       let card = $this.closest(DIV_CARD);
//       card.classList.toggle("card-fullscreen");
//       card.classList.remove("card-collapsed");
//       e.preventDefault();
//       return false;
//     });
//   });
//   /* card with fullscreen */

//   /* count-up */
//   var i = 1;
//   setInterval(() => {
//     document.querySelectorAll(".count-up").forEach((ele) => {
//       if (ele.getAttribute("data-count") >= i) {
//         i = i + 1;
//         ele.innerText = i;
//       }
//     });
//   }, 10);
//   /* count-up */

//   /* back to top */
//   const scrollToTop = document.querySelector(".scrollToTop");
//   const $rootElement = document.documentElement;
//   const $body = document.body;
//   window.onscroll = () => {
//     const scrollTop = window.scrollY || window.pageYOffset;
//     const clientHt = $rootElement.scrollHeight - $rootElement.clientHeight;
//     if (window.scrollY > 100) {
//       scrollToTop.style.display = "flex";
//     } else {
//       scrollToTop.style.display = "none";
//     }
//   };
//   scrollToTop.onclick = () => {
//     window.scrollTo(0, 0);
//   };
//   /* back to top */

//   /* header dropdowns scroll */
//   // var myHeaderShortcut = document.getElementById("header-shortcut-scroll");
//   // new SimpleBar(myHeaderShortcut, { autoHide: true });

//   var myHeadernotification = document.getElementById(
//     "header-notification-scroll"
//   );
//   new SimpleBar(myHeadernotification, { autoHide: true });

//   var myHeaderCart = document.getElementById("header-cart-items-scroll");
//   new SimpleBar(myHeaderCart, { autoHide: true });
//   /* header dropdowns scroll */
// })();

// /* full screen */
// var elem = document.documentElement;
// function openFullscreen() {
//   let open = document.querySelector(".full-screen-open");
//   let close = document.querySelector(".full-screen-close");

//   if (
//     !document.fullscreenElement &&
//     !document.webkitFullscreenElement &&
//     !document.msFullscreenElement
//   ) {
//     if (elem.requestFullscreen) {
//       elem.requestFullscreen();
//     } else if (elem.webkitRequestFullscreen) {
//       /* Safari */
//       elem.webkitRequestFullscreen();
//     } else if (elem.msRequestFullscreen) {
//       /* IE11 */
//       elem.msRequestFullscreen();
//     }
//   } else {
//     if (document.exitFullscreen) {
//       document.exitFullscreen();
//     } else if (document.webkitExitFullscreen) {
//       /* Safari */
//       document.webkitExitFullscreen();
//       console.log("working");
//     } else if (document.msExitFullscreen) {
//       /* IE11 */
//       document.msExitFullscreen();
//     }
//   }
// }
// /* full screen */

// /* toggle switches */
// let customSwitch = document.querySelectorAll(".toggle");
// customSwitch.forEach((e) =>
//   e.addEventListener("click", () => {
//     e.classList.toggle("on");
//   })
// );
// /* toggle switches */

// /* header dropdown close button */

// /* for cart dropdown */
// const headerbtn = document.querySelectorAll(".dropdown-item-close");
// headerbtn.forEach((button) => {
//   button.addEventListener("click", (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     button.parentNode.remove();
//     document.getElementById("cart-data").innerText = `${
//       document.querySelectorAll(".dropdown-item-close").length
//     } Items`;
//     document.getElementById("cart-icon-badge").innerText = `${
//       document.querySelectorAll(".dropdown-item-close").length
//     }`;
//     console.log(
//       document.getElementById("header-cart-items-scroll").children.length
//     );
//     if (document.querySelectorAll(".dropdown-item-close").length == 0) {
//       let elementHide = document.querySelector(".empty-header-item");
//       let elementShow = document.querySelector(".empty-item");
//       elementHide.classList.add("d-none");
//       elementShow.classList.remove("d-none");
//     }
//   });
// });
// /* for cart dropdown */

// /* for notifications dropdown */
// const headerbtn1 = document.querySelectorAll(".dropdown-item-close1");
// headerbtn1.forEach((button) => {
//   button.addEventListener("click", (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     button.parentNode.parentNode.parentNode.parentNode.remove();
//     document.getElementById("notifiation-data").innerText = `${
//       document.querySelectorAll(".dropdown-item-close1").length
//     } Unread`;
//     document.getElementById("notification-icon-badge").innerText = `${
//       document.querySelectorAll(".dropdown-item-close1").length
//     }`;
//     if (document.querySelectorAll(".dropdown-item-close1").length == 0) {
//       let elementHide1 = document.querySelector(".empty-header-item1");
//       let elementShow1 = document.querySelector(".empty-item1");
//       elementHide1.classList.add("d-none");
//       elementShow1.classList.remove("d-none");
//     }
//   });
// });
// /* for notifications dropdown */
