<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:template match="tournament">
    <table>
  
        <xsl:for-each select="match">
          <xsl:sort select="round" order="ascending" />
          <tbody>
            <xsl:for-each select="player">
              <tr>
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
            </xsl:for-each>  
          <tbody>   
        </xsl:for-each>  
  
    </table>
</xsl:template>
</xsl:stylesheet>