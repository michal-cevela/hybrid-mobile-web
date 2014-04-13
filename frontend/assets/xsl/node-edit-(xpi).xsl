<?xml version="1.0" encoding="UTF-8"?>

<!--
		XSL Template: Node Edit
		Author: Michal Čevela (2007)
		Email: michal.cevela@gmail.com
-->

<xsl:stylesheet version="1.0" exclude-result-prefixes="xsl rdf item"
    xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:item="item/rdf#">

   <!-- LOAD THE LANGUAGE DICTIONARY AS COLLECTION OF GLOBAL VARIABLES -->
   <!-- xsl:include href="./locale/en/node-edit.xml" /-->

   <!-- SET THE GLOBAL VARIABLES -->
   <xsl:variable name="xulform_id">xulform.node</xsl:variable>
<!--
   <xsl:value-of select="translate('The quick brown fox.', 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />
-->
   <xsl:template match="/rdf:RDF">
      <xsl:variable name="form_header" select="./rdf:Description/item:name[.='_title']/parent::node()/item:value" />

      <label id="node.header" class="header-1 dotted-bottom">
         <xsl:choose>
            <xsl:when test="$form_header = '' ">
               <xsl:attribute name="value">
                  <xsl:value-of select="'New record'" />
               </xsl:attribute>
            </xsl:when>
            
            <xsl:otherwise>
               <xsl:attribute name="value">
                  <xsl:value-of select="$form_header" />
               </xsl:attribute>
            </xsl:otherwise>
         </xsl:choose>
      </label>

      <spacer height="12" />
      <xulform id="{$xulform_id}">
   
         <grid id="grid.edit" flex="1" class="vertical-overflow"
               style="background-color:white; border:1px solid #FFEFA0; border-collapse:collapse;">
            <columns>
               <column style="border-right:1px solid #FFEFA0;" />
               <column flex="1" />
            </columns>
            <rows>
               <row align="center" height="23" style="background-color:#FFEFA0; border-bottom:1px solid #FFEFA0;">
                  <label value="Attributes" class="bold" />
               </row>

               <xsl:for-each select="./rdf:Seq/rdf:li">
                  <xsl:variable name="resource_id" select="./@rdf:resource" />
                  <xsl:variable name="item_ref"    select="/rdf:RDF/rdf:Description[@rdf:about=$resource_id]" />
                  <xsl:variable name="item_name"   select="$item_ref/item:name" />
                  <xsl:variable name="item_label"  select="$item_ref/item:label" />
                  <xsl:variable name="item_type"   select="$item_ref/item:data-type" />
                  <xsl:variable name="item_value"  select="$item_ref/item:value" />
                  <xsl:variable name="item_id"     select="concat($xulform_id,'.',$item_name)" />

                  <xsl:choose>
                     <xsl:when test="$item_name = '_leaf'     or
                                     $item_name = 'id'        or
                                     $item_name = 'id_class'  or
                                     $item_name = 'is_deleted' ">
                     
                        <hidden id="{$item_id}" value="{$item_value}" />
                     </xsl:when>

                     <xsl:otherwise>
                        <!-- * START "row" * -->
                        <row align="center" style="border-bottom:1px solid #FFEFA0;">
                           <vbox>
                              <label value="{$item_label}" />
                              <label value="{concat('[',$item_name,']')}" class="font-10px gray" />
                           </vbox>
                           <hbox>
                              <!-- Data-type: Boolean -->
                              <xsl:if test="$item_type = 'Boolean'">
                                 <checkbox id="{$item_id}" checked="{$item_value}"
                                           onfocus="this.parentNode.focus();" />
                              </xsl:if>
                              
                              <!-- Data-type: BooleanOrNull -->
                              <xsl:if test="$item_type = 'BooleanOrNull'">
                                 <radiogroup id="{$item_id}" orient="horizontal">
                                    <!-- radio value="true"  label="{$text_boolean_true}"-->
                                    <radio value="true"  label="Yes">
                                       <xsl:if test="$item_value = 'true'">
                                          <xsl:attribute name="selected">true</xsl:attribute>
                                       </xsl:if>
                                    </radio>
                                    
                                    <!-- radio value="true"  label="{$text_boolean_false}"-->
                                    <radio value="false" label="No">
                                       <xsl:if test="$item_value = 'false'">
                                          <xsl:attribute name="selected">true</xsl:attribute>
                                       </xsl:if>
                                    </radio>
                                    
                                    <!-- radio value="true"  label="{$text_boolean_undefined}"-->
                                    <radio value="null"  label="Undefined">
                                       <xsl:if test="$item_value = 'null'">
                                          <xsl:attribute name="selected">true</xsl:attribute>
                                       </xsl:if>
                                    </radio>
                                 </radiogroup>
                              </xsl:if>
                              
                              <!-- Data-type: Password -->
                              <xsl:if test="$item_type = 'Password'">
                                 <vbox>
                                    <spacer height="2" />
                                    
                                    <xsl:if test="$item_value = 'true'">
                                       <hbox height="18">
                                          <!-- label value="{$text_password_set}" class="bold" /-->
                                          <label value="Password is already set" class="bold" />
                                       </hbox>
                                    </xsl:if>

                                    <grid>
                                       <rows>
                                          <row align="center">
                                             <!-- label value="{$text_password_new}" /-->
                                             <label value="New password:" />
                                             <textbox id="{$item_id}" type="password" size="20" />
                                          </row>
                                          <row align="center">
                                             <!-- label value="{$text_password_confirm}" /-->
                                             <label value="Confirm password:" />
                                             <textbox id="{concat($item_id,'_confirm')}" type="password" size="20" />
                                          </row>
                                          <row height="2" />
                                       </rows>
                                    </grid>
                                 </vbox>
                              </xsl:if>
                              
                              <!-- Data-type: SmallInt/BigInt/Float -->
                              <xsl:if test="$item_type = 'SmallInt' or
                                            $item_type = 'BigInt'   or
                                            $item_type = 'Float' ">

                                 <textbox id="{$item_id}" value="{$item_value}" class="Date-width" maxlength="20" />
                              </xsl:if>
                              
                              <!-- Data-type: ShortText -->
                              <xsl:if test="$item_type = 'ShortText' ">
                                 <textbox id="{$item_id}" value="{$item_value}" size="45" />
                              </xsl:if>

                              <!-- Data-type: LongText -->
                              <xsl:if test="$item_type = 'LongText' ">
                                 <textbox id="{$item_id}" value="{$item_value}" multiline="true" cols="42" rows="5" />
                              </xsl:if>

                              <!-- Data-type: Ref/RefComponent -->
                              <xsl:if test="$item_type = 'Ref' or
                                            $item_type = 'RefComponent' ">

                                 <menulist id="{$item_id}">
                                    <menupopup>
                                       
                                       <xsl:choose>
                                          <xsl:when test="count($item_value/item:menu) > 0">
                                             <xsl:for-each select="$item_value/item:menu">
                                                <menuitem label="{.}" value="{./@id}" selected="true" />
                                             </xsl:for-each>
                                          </xsl:when>
                                          
                                          <xsl:otherwise>
                                             <!-- menuitem label="{$text_menuitem_null}" value="undefined" /-->
                                             <menuitem label=" -- undefined -- " value="undefined" />
                                          </xsl:otherwise>
                                       </xsl:choose>
                                       
                                    </menupopup>
                                 </menulist>
                              </xsl:if>

                              <!-- Data-type: MultiRef/MultiRefRel -->
                              <xsl:if test="$item_type = 'MultiRef' or
                                            $item_type = 'MultiRefRel' ">

                                 <vbox>
                                    <listbox id="{$item_id}" seltype="{$item_value/@select}" datatype="{$item_type}"
                                             name="{$item_name}" rows="3" minwidth="250">

                                       <xsl:for-each select="$item_value/item:menu">
                                          <listitem label="{.}" value="{./@id}" selected="true" />
                                       </xsl:for-each>
                                    </listbox>

                                    <xsl:if test="$item_type = 'MultiRefRel'">
                                       <vbox id="{concat('vbox::ref#',$item_name,'::rels')}">
                                       
                                       <xsl:for-each select="$item_value/item:menu">
                                          <vbox id="{concat('vbox::ref#',$item_name,'::rel#',./@id)}">
                                             <label value="{concat('Relevance to: ',.)}" />
                                             <textbox id="{concat($item_name,'::rel#',./@id)}"
                                                      value="{./@rel}" />
                                          </vbox>
                                       </xsl:for-each>
                                       
                                       </vbox>
                                    </xsl:if>

                                 </vbox>
                              </xsl:if>

                              <!-- Data-type: Date -->
                              <xsl:if test="$item_type = 'Date'">
                                 <textbox id="{concat($item_id,'::time#1')}" value="{$item_value}"
                                          size="10" maxlength="10" class="Date-width" />
                              </xsl:if>

                              <!-- Data-type: DateTime -->
                              <xsl:if test="$item_type = 'DateTime' ">
                                 <textbox id="{concat($item_id,'::time#1')}"
                                          value="{substring-before($item_value,' ')}"
                                          size="10" maxlength="10" class="Date-width" />

                                 <textbox id="{concat($item_id,'::time#2')}"
                                          value="{substring-after($item_value,' ')}"
                                          size="8" maxlength="8" class="Time-width" />
                              </xsl:if>

                              <!-- Data-type: Timestamp -->
                              <xsl:if test="$item_type = 'Timestamp' ">
                                 <textbox id="{concat($item_id,'::time#1')}"
                                          value="{substring-before($item_value,' ')}"
                                          size="10" maxlength="10" class="Date-width" />

                                 <textbox id="{concat($item_id,'::time#2')}"
                                          value="{substring-after($item_value,' ')}"
                                          size="12" maxlength="12" class="Timestamp-width" />
                              </xsl:if>

                              <!-- Data-type: TimestampZone -->
                              <xsl:if test="$item_type = 'TimestampZone' ">
                                 <textbox id="{concat($item_id,'::time#1')}"
                                          value="{substring-before($item_value,' ')}"
                                          size="10" maxlength="10" class="Date-width" />

                                 <textbox id="{concat($item_id,'::time#2')}"
                                          value="{substring($item_value,12,12)}"
                                          size="12" maxlength="12" class="Timestamp-width" />

                                 <textbox id="{concat($item_id,'::time#3')}"
                                          value="{substring($item_value,24,3)}"
                                          size="3"  maxlength="3"  class="TimeZone-width" />
                              </xsl:if>

                              <!-- Data-type: Wysiwyg -->
                              <xsl:if test="$item_type = 'Wysiwyg' ">
                                 <xsl:attribute name="orient">vertical</xsl:attribute>

                                 <vbox>
                                    <label  id="label.wysiwyg" value="Wysiwyg text 256 znaku..." />
                                    <hidden id="{$item_id}" value="{$item_value}" />
                                 </vbox>
                                 <button label="WYSIWYG" class="bold" maxwidth="100"
                                         onclick="this.parentNode.focus();
                                                  var $url_param_ds = 'ds=' + window.opener.dataset_id + '&amp;';
                                                  var $url_param_de = 'de={$item_name}' + '&amp;';
                                                  var $url_param_dn = 'dn=' + window.opener.node_id;
                                                  window.openWysiwyg($url_param_ds + $url_param_de + $url_param_dn);
                                                 " />
                              </xsl:if>

                           </hbox>
                        </row>
                        <!-- * END "row" * -->
                     </xsl:otherwise>

                  </xsl:choose>
               </xsl:for-each>

            </rows>
         </grid>
      </xulform>

      <vbox>
         <hbox class="padding-top-4px">
            <spacer flex="1" />
            
            <!-- button id="button.save" label="{$text_button_save}" -->
            <button id="button.save" label="Save"
                    onclick="this.parentNode.focus();
                             var $script_url = window._PHP['node-change'] + '?action=' + window.opener.datanode_action +
                                                                            '&amp;ds=' + window.opener.dataset_id + 
                                                                            '&amp;dn=' + window.opener.datanode_id;
                             
                             var $label_result = new XUL('label.result_message').getObject(); 
                             var $result = new XULForm('{$xulform_id}').sendFormData($script_url, 'RDF', this, $label_result);
                            " />
            
            <button id="button.close" label="Close"
                    onclick="window.close();" />
         </hbox>
<!--         
         <hbox flex="1">
            <spacer flex="1" />
            <vbox>
               <spacer flex="1" />
               <label  id="label.result_message" class="font-13px bold red" />
               <spacer flex="1" />
            </vbox>
            <spacer flex="1" />
         </hbox>
-->
      </vbox>
      
   </xsl:template>

</xsl:stylesheet>
