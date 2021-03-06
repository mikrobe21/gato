[#list components as component]
  [#assign hasBackgroundClass = (component.showBackgroundColor!false)?string(' has-background','')]
  [#assign cardLayoutClass = gf.isCardSection(component)?string(' card-layout', '')]
  [#assign patternClass = gf.isPattern(component)?then(' pattern', '')]
  <div class="gato-section-full full-width ${hasBackgroundClass}${cardLayoutClass}${patternClass}">
    <div class="gato-section-centered">
      <div class="gato-section eq-parent">
        [@cms.component content=component /]
      </div>
    </div>
  </div>
[/#list]
[#if cmsfn.isEditMode()]
  <div class="mobilefirst_component_add" cms:add="box"></div>
[/#if]
