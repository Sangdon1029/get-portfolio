chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "fetchElementData") {
    // id가 portfolioModal인 요소를 가져옴
    const element = document.getElementById('portfolioModal');
    
    if (element) {
      // 요소의 dataset에서 필요한 data-* 속성들을 추출
      const dataExpertName = element?.dataset?.expertname;  // data-expert-name 속성 값
      const dataCode = element.dataset.code;  // data-code 속성 값
      const prefix = 'https://cdn-optimized.imweb.me/';
      const dataUrl = `${prefix}${element.dataset.url}`;    // data-url 속성 값
      const dataTitle = element.dataset.title;  // data-title 속성 값
      const dataDomain = element.dataset.domain; // data-domain 속성 값
      
      // 데이터를 객체로 만들어 보냄
      const elementData = {
        code: dataCode,
        url: dataUrl,
        title: dataTitle,
        domain: dataDomain,
        expertName: dataExpertName
      };

      // 추출한 데이터를 popup.js나 다른 스크립트로 전달
      chrome.runtime.sendMessage({action: "updateElementData", data: elementData});
    } else {
      console.log("Element with ID 'portfolioModal' not found.");
      chrome.runtime.sendMessage({action: "updateElementData", data: 'Element not found'});
    }
  }
});
