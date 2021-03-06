[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
<div class="mobilefirst-pattern">
  <div class="pattern-content single arrow title-type text-center importantdates">
    <div class="centered">
      <h2 class="title">${content.title}</h2>
      [#if content.events?has_content]
      <div class="events">
          [#list cmsfn.children(content.events) as lnk]
            <div class="flex-child">
              <!--Get day of the month-->
              <h2>
                <div class="day">${lnk.date?string["dd"]}</div> 
                <div class="month">${lnk.date?string["MMM"]?upper_case}</div>
              </h2>
              <div class="links">
                <ul>
                  <li><a href="${gf.filterUrl(lnk.link)}">${lnk.title!}</a></li>
                </ul>
              </div>
            </div>
          [/#list]
        </div>
      [/#if]
      </div>
    </div>
</div>