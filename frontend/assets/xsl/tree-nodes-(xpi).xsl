<?xml version="1.0" encoding="UTF-8"?>

<!--
		XSL Template: Tree Nodes
		Author: Michal Čevela (2007)
		Email: michal.cevela@gmail.com
-->

<xsl:stylesheet version="1.0" exclude-result-prefixes="xsl rdf column"
    xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:column="column/rdf#">

   <!-- SET THE XSL PARAMS PASSED FROM JAVASCRIPT -->
   <xsl:param name="view_column_id"  select="false" />
   <xsl:param name="view_column_lng" select="true" />

   <!-- SET THE NUMBER OF VISIBLE COLUMNS (INCLUDING HIDDEN SYSTEM ONES -->
   <xsl:variable name="number_visible_columns" select="10" />

   <!-- GENERATE XUL CODE -->
   <xsl:template match="/rdf:RDF">

      <tree id="tree.nodes" class="folder-image orange-items zig-zag sortDirectionIndicator" 
            flex="1" seltype="single" enableColumnDrag="true" hidecolumnpicker="false"
            datasources="rdf:null" ref="node:all" context="context.tree.nodes"

            onselect    = "window.datanode_id = new XULTree(this.id).getCellValue(this.currentIndex,'id');"
            onmousemove = "new XULTree(this.id).setItemsHover(event);"
            onmouseout  = "new XULTree(this.id).clearItemsHover();">

         <treecols id="tree.nodes.columns" pickertooltiptext="Click to select the column to be shown">
            <treecol class="treecol-image icon-subitems padding-right-5px" persist="width hidden ordinal"
                     ignoreincolumnpicker="true" tooltiptext="Click to show/hide all sub-items"
                     onclick="new XULTree('tree.nodes').viewSubItems('tree.nodes._title');" />

            <treecol class="treecol-image icon-threads padding-right-5px" persist="width hidden ordinal"
                     ignoreincolumnpicker="true" tooltiptext="Click to show/hide the thread"
                     onclick="new XULTree('tree.nodes').viewThreads('tree.nodes._title',
                                                                     window._RDF_MEMORY[window.selected_RDF_in_MEMORY]);" />

            <xsl:for-each select="./rdf:Seq/rdf:li">
               <xsl:variable name="resource_id"  select="@rdf:resource" />
               <xsl:variable name="column_ref"   select="/rdf:RDF/rdf:Description[@rdf:about=$resource_id]" />
               <xsl:variable name="column_name"  select="$column_ref/column:name" />
               <xsl:variable name="column_label" select="$column_ref/column:label" />
               <xsl:variable name="column_type"  select="$column_ref/column:data-type" />

               <!-- * START "treecol" * -->
               <treecol flex="1" persist="width hidden ordinal" sortDirection="natural"
                        onclick="new XULTree('tree.nodes').sortByColumn(this);">

                  <!-- SET "id" (attribute) -->
                  <xsl:attribute name="id">
                     <xsl:value-of select="concat('tree.nodes.',$column_name)" />
                  </xsl:attribute>

                  <!-- SET "label" (attribute) -->
                  <xsl:attribute name="label">
                     <xsl:value-of select="$column_label" />
                  </xsl:attribute>

                  <!-- SET "sort" (attribute) -->
                  <xsl:attribute name="sort">
                     <xsl:value-of select="concat('rdf:node/rdf#',$column_name)" />
                  </xsl:attribute>

                  <!-- SET "sortResource" (attribute) -->
                  <xsl:attribute name="sortResource">
                     <xsl:value-of select="concat('rdf:node/rdf#',$column_name)" />
                  </xsl:attribute>

                  <!-- SET "type" (attribute) -->
                  <xsl:if test="$column_type = 'Boolean' or $column_type = 'BooleanOrNull'">
                     <xsl:attribute name="flex">1</xsl:attribute>
                     <xsl:attribute name="type">checkbox</xsl:attribute>
                     <xsl:attribute name="editable">true</xsl:attribute>
                  </xsl:if>

                  <!-- SELECT THE COLUMNS TO VIEW/HIDE -->
                  <xsl:choose>
                     <xsl:when test="( $column_name = 'id'  and not(boolean($view_column_id))  ) or 
                                     ( $column_name = 'lng' and not(boolean($view_column_lng)) ) or
                                       $column_name = '_leaf'      or
                                       $column_name = 'id_class'   or
                                       $column_name = 'is_active'  or 
                                       $column_name = 'is_deleted' ">

                        <!-- SET "hidden" (attribute) -->
                        <xsl:attribute name="hidden">true</xsl:attribute>

                        <!-- SET "ignoreincolumnpicker" (attribute) -->
                        <xsl:attribute name="ignoreincolumnpicker">true</xsl:attribute>
                     </xsl:when>
   
                     <xsl:otherwise>
                        <!-- SET "primary, flex" (attribute) -->
                        <xsl:choose>
                           <xsl:when test="$column_name = '_title'">
                              <xsl:attribute name="primary">true</xsl:attribute>
                              <xsl:attribute name="flex">3</xsl:attribute>
                           </xsl:when>

                           <xsl:otherwise>
                              <xsl:attribute name="flex">2</xsl:attribute>
                           </xsl:otherwise>
                        </xsl:choose>

                        <!-- SET "hidden" (attribute)
                             [ "false" for the first 13 columns including the system ones ] -->
                        <xsl:choose>
                           <xsl:when test="position() &lt; $number_visible_columns">
                              <xsl:attribute name="hidden">false</xsl:attribute>
                           </xsl:when>

                           <xsl:otherwise>
                              <xsl:attribute name="hidden">true</xsl:attribute>
                           </xsl:otherwise>
                        </xsl:choose>

                     </xsl:otherwise>
                  </xsl:choose>

               <!-- * END "treecol" * -->
               </treecol>

            </xsl:for-each>

         <!-- * END "treecols" * -->
         </treecols>

         <template>
            <rule>
               <treechildren>
                  <treeitem uri="rdf:*" open="false">

                     <!-- * START "treerow" * -->
                     <treerow>
                        <xsl:attribute name="properties">
                           <xsl:text>active_rdf:node/rdf#is_active deleted_rdf:node/rdf#is_deleted</xsl:text>
                        </xsl:attribute>

                        <!-- START "treecell" FOR THE FIRST/SECOND COLUMN (SUBITEMS/THREADS) -->
                        <treecell value="" />
                        <treecell value="" />

                        <xsl:for-each select="./rdf:Seq/rdf:li">
                           <xsl:variable name="resource_id"  select="@rdf:resource" />
                           <xsl:variable name="column_ref"   select="/rdf:RDF/rdf:Description[@rdf:about=$resource_id]" />
                           <xsl:variable name="column_name"  select="$column_ref/column:name" />
                           <xsl:variable name="column_type"  select="$column_ref/column:data-type" />

                           <!-- * START "treecell" * -->
                           <treecell>

                              <!-- SET "properties" (attribute) FOR "_title" COLUMN -->
                              <xsl:if test="$column_name = '_title'">
                                 <xsl:attribute name="properties">is_primary</xsl:attribute>
                              </xsl:if>

                              <xsl:choose>
                                 <xsl:when test="$column_type = 'Boolean' or $column_type = 'BooleanOrNull'">
                                    <xsl:attribute name="value">
                                       <xsl:value-of select="concat('rdf:node/rdf#',$column_name)" />
                                    </xsl:attribute>
                                 </xsl:when>
            
                                 <xsl:otherwise>
                                    <xsl:attribute name="label">
                                       <xsl:value-of select="concat('rdf:node/rdf#',$column_name)" />
                                    </xsl:attribute>
                                 </xsl:otherwise>
                              </xsl:choose>

                           <!-- * END "treecell" * -->
                           </treecell>

                        </xsl:for-each>

                     <!-- * END "treerow" * -->
                     </treerow>
                  </treeitem>
               </treechildren>
            </rule>
         </template>

      </tree>

   </xsl:template>

</xsl:stylesheet>
