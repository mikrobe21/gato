package edu.txstate.its.gato.componentselect;

import info.magnolia.context.MgnlContext;

import info.magnolia.ui.form.field.definition.FieldDefinition;
import info.magnolia.ui.form.field.factory.AbstractFieldFactory;
import com.vaadin.data.Item;
import com.vaadin.ui.Field;

import info.magnolia.pages.app.editor.PageEditorPresenter;
import info.magnolia.pages.app.field.TemplateSelectorFieldFactory;
import info.magnolia.registry.RegistrationException;
import info.magnolia.rendering.template.TemplateDefinition;
import info.magnolia.rendering.template.registry.TemplateDefinitionRegistry;
import info.magnolia.ui.vaadin.gwt.client.shared.AreaElement;

import java.util.ArrayList;
import java.util.List;
import java.util.LinkedHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;

public class GatoComponentSelectorFactory<D extends FieldDefinition> extends AbstractFieldFactory<GatoComponentSelectorDefinition, String>{

    private static final Logger log = LoggerFactory.getLogger(GatoComponentSelectorFactory.class);

    private final TemplateDefinitionRegistry templateRegistry;
    private final PageEditorPresenter pageEditorPresenter;

    @Inject
    public GatoComponentSelectorFactory(GatoComponentSelectorDefinition definition, Item relatedFieldItem, TemplateDefinitionRegistry templateRegistry, PageEditorPresenter pageEditorPresenter) {
        super(definition, relatedFieldItem);
        this.templateRegistry = templateRegistry;
        this.pageEditorPresenter = pageEditorPresenter;
    }

    @Override
    protected Field<String> createFieldComponent() {
        //pass that list to the field constructor
        LinkedHashMap<String,ArrayList<GatoComponentSelectOption>> availableTemplates = getAvailableTemplates();
        GatoComponentSelector field = new GatoComponentSelector(availableTemplates);
        return field;
    }

    private LinkedHashMap<String,ArrayList<GatoComponentSelectOption>> getAvailableTemplates(){

        ArrayList<GatoComponentSelectOption> templates = new ArrayList<GatoComponentSelectOption>();

        LinkedHashMap<String,ArrayList<GatoComponentSelectOption>> hashmap = new LinkedHashMap<String,ArrayList<GatoComponentSelectOption>>();
        //make sure we are actually working with an area before trying to get the
        //components from the area
        if (!(pageEditorPresenter.getSelectedElement() instanceof AreaElement)) {
            log.warn("Cannot get available components, selected element {} is not an area.", pageEditorPresenter.getSelectedElement());
            //return templates;
            return hashmap;
        }

        AreaElement area = (AreaElement) pageEditorPresenter.getSelectedElement();
        String availableComponents = area.getAvailableComponents();

        String[] tokens = availableComponents.split(",");
        for (String token : tokens) {
          try {
            TemplateDefinition templateDefinition = templateRegistry.getTemplateDefinition(token);
            GatoComponentSelectOption option = new GatoComponentSelectOption();
            option.setComponentId(templateDefinition.getId());
            option.setTitle(TemplateSelectorFieldFactory.getI18nTitle(templateDefinition));
            option.setDescription(templateDefinition.getDescription());
            String imgSrc="";
            Object iconPathFromDef = templateDefinition.getParameters().get("icon");
            if(iconPathFromDef != null){
                String cpath = MgnlContext.getContextPath();
                imgSrc = cpath + "/.resources/" + iconPathFromDef.toString();
            }
            option.setIconPath(imgSrc);
            String tabName = "Content";
            if (templateDefinition.getParameters().get("tab") != null)
              tabName = (String) templateDefinition.getParameters().get("tab");
            option.setTabName(tabName);
            if (hashmap.containsKey(tabName)) {
              hashmap.get(tabName).add(option);
            }
            else {
              hashmap.put(tabName, new ArrayList<GatoComponentSelectOption>());
              hashmap.get(tabName).add(option);
            }
          } catch(RegistrationException e) {
            log.error("Could not get TemplateDefinition for id '{}'.", token, e);
          }
        }

/*
        for (String token : tokens) {
            try {
                TemplateDefinition templateDefinition = templateRegistry.getTemplateDefinition(token);

                GatoComponentSelectOption option = new GatoComponentSelectOption();
                option.setComponentId(templateDefinition.getId());
                option.setTitle(TemplateSelectorFieldFactory.getI18nTitle(templateDefinition));
                option.setDescription(templateDefinition.getDescription());
                String tabName = "Other";
                if (templateDefinition.getParameters().get("tab") != null)
                  tabName = (String) templateDefinition.getParameters().get("tab");
                option.setTabName(tabName);
                //For testing
                //String imgSrc = MgnlContext.getContextPath() + "/.resources/gato-component-button/images/button.png";  //DO NOT LEAVE THIS HERE
                String imgSrc="";
                Object iconPathFromDef = templateDefinition.getParameters().get("icon");
                if(iconPathFromDef != null){
                    String cpath = MgnlContext.getContextPath();
                    imgSrc = cpath + "/.resources/" + iconPathFromDef.toString();
                }
                option.setIconPath(imgSrc);
                templates.add(option);
            } catch (RegistrationException e) {
                log.error("Could not get TemplateDefinition for id '{}'.", token, e);
            }
        }

        */
        //return templates;
        return hashmap;
    }


}
