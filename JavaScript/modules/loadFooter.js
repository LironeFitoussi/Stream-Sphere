export default function getFooter() {
    console.log("footer Loaded");
    const footerContent = $("<footer>");
    footerContent.html(
      `
        <p>&copy; 2023 StreamSphere. All rights reserved. | Developed by Fistuk</p>
      `
    );
    $(footerContent).insertAfter("main");
  }
  