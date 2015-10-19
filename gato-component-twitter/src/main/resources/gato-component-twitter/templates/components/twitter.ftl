<div class="gato-twitter-feed ${content.align}">
  [#if content.title?has_content]
    <h2>${content.title}</h2>
  [/#if]

  <div class="center-me">
    <div class="center-me-in-ie">

      [#list model.tweets as tweet]
        <div class="tweet" id="tweet-${tweet.id}">
          <a class="tweet-logo-link" href="https://twitter.com/${tweet.screenName}" title="@${tweet.screenName}">
            <img class="tweet-logo" alt="Icon for user ${tweet.screenName}" src="${tweet.icon}"/>
          </a>
          <div class="screen-name">
            <a href="https://twitter.com/${tweet.screenName}">@${tweet.screenName}</a></div>
          <div class="text">${tweet.text}</div>
          <div class="created_at" title="${tweet.createdAt}">${tweet.createdAt}</div>
        </div>
      [/#list]
      
      [#if cmsfn.editMode && (model.termCount == 0 || model.resultCount == 0 || !model.messages?has_content)]
        <div class="txst-khan-alert txst-khan-notice txst-tweet-alert">
          
          [#if model.termCount == 0]
            <p>No valid query parameters entered.</p>
            <p>Only <strong>@screen_names</strong> and <strong>#hashtags</strong> are supported.</p>
          [/#if]
          
          [#if model.termCount gt 0 && model.resultCount == 0]
            <p>
              It may take up to five minutes for tweets to show up. 
              If it has been longer than five minutes, double check your search
              parameters for misspellings.
            </p>
          [/#if]
          
          [#if model.messages?has_content]
            <div class="tweet-error">
              <h3 class="tweet-error">Note:</h3>
              [#list model.messages as message]
                <p>${message}</p> 
              [/#list]
            </div>
          [/#if]
        </div>
      [/#if]

    </div>
  </div>
</div>
