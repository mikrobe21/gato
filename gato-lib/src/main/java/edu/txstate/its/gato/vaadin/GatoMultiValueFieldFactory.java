package edu.txstate.its.gato.vaadin;

import info.magnolia.objectfactory.ComponentProvider;
import info.magnolia.ui.api.i18n.I18NAuthoringSupport;
//import info.magnolia.ui.form.field.definition.MultiValueFieldDefinition;
import info.magnolia.ui.form.field.factory.FieldFactoryFactory;
import info.magnolia.ui.form.field.factory.AbstractFieldFactory;
import info.magnolia.ui.form.field.transformer.multi.DelegatingMultiValueFieldTransformer;
import com.vaadin.v7.data.util.PropertysetItem;

import javax.inject.Inject;

import com.vaadin.v7.data.Item;
import com.vaadin.v7.ui.Field;

public class GatoMultiValueFieldFactory extends AbstractFieldFactory<GatoMultiValueFieldDefinition, PropertysetItem> {

  private FieldFactoryFactory fieldFactoryFactory;
  private ComponentProvider componentProvider;
  private I18NAuthoringSupport i18nAuthoringSupport;

  @Inject
  public GatoMultiValueFieldFactory(GatoMultiValueFieldDefinition definition, Item relatedFieldItem, FieldFactoryFactory fieldFactoryFactory, ComponentProvider componentProvider, I18NAuthoringSupport i18nAuthoringSupport) {
    super(definition, relatedFieldItem);
    this.fieldFactoryFactory = fieldFactoryFactory;
    this.componentProvider = componentProvider;
    this.i18nAuthoringSupport = i18nAuthoringSupport;
  }

  @Override
  protected Field<PropertysetItem> createFieldComponent() {
    // FIXME change i18n setting : MGNLUI-1548
    definition.setI18nBasename(getMessages().getBasename());
    GatoMultiField field = new GatoMultiField(definition, fieldFactoryFactory, componentProvider, item, i18nAuthoringSupport);
    // Set Caption
    field.setButtonCaptionAdd(getMessage(definition.getButtonSelectAddLabel()));
    field.setButtonCaptionRemove(getMessage(definition.getButtonSelectRemoveLabel()));
    boolean isUnOrderable = DelegatingMultiValueFieldTransformer.class.isAssignableFrom(definition.getTransformerClass());
    field.setOrderable(!isUnOrderable);

    field.setMaxFields(definition.getMaxFields());
    field.setMinFields(definition.getMinFields());

    return field;
  }

}
