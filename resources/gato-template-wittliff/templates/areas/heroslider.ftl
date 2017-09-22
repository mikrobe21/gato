[#if cmsfn.isEditMode()]
  <div cms:edit class="slides-admin">
    [#list components as slide]
      [@cms.component content=slide contextAttributes={"barsonly": true} /]
    [/#list]
    <div class="${(components?size < 10)?string('heroslider_add','heroslider_max')}" cms:add="bar"></div>
  </div>
[/#if]
<div class="slides">
  [#list components as slide]
    [@cms.component content=slide contextAttributes={"slideactive": (slide_index == 0)?string("active", "")} editable=false /]
  [/#list]
</div>