<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:template match="tournament">
    
  
        <xsl:for-each select="match">
          <xsl:sort select="round" order="ascending"/>

          <xsl:if id="round" test="round > 0">

            <tbody>
            
            <xsl:for-each select="player">
              
              <xsl:if id="set_count" test="count(set) > 0">

              <xsl:variable name="vOutcome">
                <xsl:choose>
                  <xsl:when test="outcome='won'">
                   <xsl:text>won</xsl:text>
                  </xsl:when>
                  <xsl:otherwise>lost</xsl:otherwise>
                </xsl:choose>
              </xsl:variable>
                
              <tr class="{$vOutcome}">
                <td><xsl:value-of select="../round"/></td>
                <td><xsl:value-of select="name"/></td>
                <xsl:for-each select="set">
                  <td><xsl:value-of select="self::node()"/></td>
                  <xsl:choose>
                     <xsl:when test="(position()=last()) and (position() = 2)">
                       <td></td><td></td><td></td>
                     </xsl:when>
                     <xsl:when test="(position()=last()) and (position() = 3)">
                       <td></td><td></td>
                     </xsl:when>
                     <xsl:when test="(position()=last()) and (position() = 4)">
                       <td></td>
                     </xsl:when>
                  </xsl:choose>
                </xsl:for-each>
              </tr>
                
              </xsl:if>
            </xsl:for-each>  
            </tbody>  
          </xsl:if> 
        </xsl:for-each>  
</xsl:template>
</xsl:stylesheet>