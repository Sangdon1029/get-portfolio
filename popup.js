const slackEndPoint = "https://hooks.slack.com/services/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";
const sendMessageToSlackWithFile = (message, fileUrl) => {
  fetch(slackEndPoint, {
    method: 'POST',
    body: JSON.stringify({
      text: message,
      attachments: [
        {
          imageUrl: fileUrl,
          thumb_url: fileUrl,
          color: "#36a64f",
          fields: [
            {
              imageUrl: fileUrl,
              short: false
            }
          ]
        }
      ]
    })
  }).then((response) => {
    console.log("Message sent to Slack: ", message);
    console.log("File URL: ", fileUrl);
  }).catch((error) => {
    console.error("Error sending message to Slack: ", error);
  });
}
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    document.getElementById('result').innerText = "복사하였습니다.";
    console.log("Markdown data copied to clipboard: ", text);
  }).catch(err => {
    document.getElementById('result').innerText = "뭔가 잘못되었습니다.";
    console.log("Markdown data copied to clipboard: ", text);
  });
}
const getTabUrl = () =>{
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const tabUrl = tabs[0].url;
    const url = new URL(tabUrl);
    const domain = url.hostname;
    return domain;
  });
}

/**
 * @param {*} url 
 * @returns  
 * - production: imweb.me
 * - development: localhost / imtest.me
 */
const detectHost = (url) => {
  if(String(url).includes("imweb")){
    return "production";
  } else {
    return "development";
  }
}
document.getElementById('btn').addEventListener('click', function() {
  const domain = getTabUrl();
  const isTestServer = detectHost(domain) === "development";
  const testServerCdnUrl = "https://cdn-test.imtest.me";
  const productionCdnUrl = "https://cdn-optimized.imweb.me";
  const prefix = isTestServer ? testServerCdnUrl : productionCdnUrl;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // 현재 활성화된 탭에 메시지 전송
      chrome.tabs.sendMessage(tabs[0].id, {action: "copy", prefix: prefix, isTestServer: isTestServer});
  });
});

document.getElementById('btn_2').addEventListener('click', function() {
  const domain = getTabUrl();
  const isTestServer = detectHost(domain) === "development";
  const testServerCdnUrl = "https://cdn-test.imtest.me";
  const productionCdnUrl = "https://cdn-optimized.imweb.me";
  const prefix = isTestServer ? testServerCdnUrl : productionCdnUrl;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // 현재 활성화된 탭에 메시지 전송
      chrome.tabs.sendMessage(tabs[0].id, {action: "sendToSlack", prefix: prefix, isTestServer: isTestServer});
  });
});

// 데이터를 받아서 팝업에 출력하는 로직 (선택 사항)
chrome.runtime.onMessage.addListener((message) => {
  
  if(message.data.title === undefined){
    document.getElementById('result').innerText = "포트폴리오를 선택해주세요";
    alert("포트폴리오를 선택해주세요");
    return null
  } 

  const markdownText = `
  ${message.data.domain}
  - ${message.data.title}
  - ${message.data.expertName}
  - portfolio_link : ${message.data.portfolioLink}
  - imageUrl: ${message.data.url}
  `.trim(); 

  // 클립보드에 복사하기 
  if(message.action === "copy"){
    copyToClipboard(markdownText);
  }
  if (message.action === "sendToSlack") {
    sendMessageToSlackWithFile(markdownText, message.data.url);
  }
});

