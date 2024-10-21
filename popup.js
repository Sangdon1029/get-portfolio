document.getElementById('btn').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // 현재 활성화된 탭에 메시지 전송
      chrome.tabs.sendMessage(tabs[0].id, {action: "fetchElementData"});
  });
});

// 데이터를 받아서 팝업에 출력하는 로직 (선택 사항)
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateElementData") {
    // 클립보드에 복사하기 

    const markdownText = `
    ${message.data.domain}
    - ${message.data.title}
    - ${message.data.expertName}
    - **[${message.data.code}](https://imweb.me/expert/portfolio-detail/${message.data.code})**
    - **imageUrl: [${message.data.url}](${message.data.url})**
    `.trim();  // 불필요한 공백 제거
        
    navigator.clipboard.writeText(markdownText).then(() => {
      document.getElementById('result').innerText = "copy to clipboard";
      console.log("Markdown data copied to clipboard: ", markdownText);
    }).catch(err => {
      document.getElementById('result').innerText = "something wrong";
      console.log("Markdown data copied to clipboard: ", markdownText);
    });
  }
});

