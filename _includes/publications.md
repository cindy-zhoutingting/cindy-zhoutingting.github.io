<div class="publications">
<ol class="bibliography">

{% assign sorted_papers = site.data.publications.main | sort: "year" | reverse %}

{% for link in sorted_papers %}
  {% if page.layout == 'homepage' and link.selected != true %}
    {% continue %}
  {% endif %}

  <li id="{{ link.id }}" class="publication-item">
  <div class="pub-row">
    <div class="col-sm-3 abbr" style="position: relative;padding-right: 15px;padding-left: 15px;">
      {% if link.image %}
      <img src="{{ link.image }}" class="teaser img-fluid z-depth-1" style="width=100;height=40%">
      {% if link.conference_short %}
      <abbr class="badge">{{ link.conference_short }}</abbr>
      {% endif %}
      {% endif %}
    </div>
    <div class="col-sm-9" style="position: relative;padding-right: 15px;padding-left: 20px;">
        <div class="title"><a href="{{ link.pdf }}">{{ link.title }}</a></div>
        <div class="author">
          {{ link.authors | replace: "Jun-Peng Zhu", '<strong><em style="color: #0A4B8F; font-weight: 600;">Jun-Peng Zhu</em></strong>' | replace: "Peng Cai", 'Peng Cai<sup><i class="fas fa-envelope" style="font-size: 0.8em;"></i></sup>' }}
        </div>
        <div class="periodical" style="font-weight: bold; font-size: 1.08em; color: #0A4B8F; margin-bottom: 2px;">
          <em>{{ link.conference }}</em>
        </div>
      <div class="links">
        {% if link.pdf %}
        <a href="{{ link.pdf }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">
          <i class="fas fa-file-pdf"></i> PDF
        </a>
        {% endif %}
        {% if link.code %}
        <a href="{{ link.code }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">
          <i class="fas fa-code"></i> Code
        </a>
        {% endif %}
        {% if link.video %}
        <a href="{{ link.video }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">
          <i class="fas fa-video"></i> Video
        </a>
        {% endif %}
        {% if link.page %}
        <a href="{{ link.page }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">
          <i class="fas fa-globe"></i> Project Page
        </a>
        {% endif %}
        {% if link.blog %}
        <a href="{{ link.blog }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">
          <i class="fas fa-pen-nib"></i> Blog
        </a>
        {% endif %}
        {% if link.bibtex %}
        <a href="{{ link.bibtex }}" class="btn btn-sm z-depth-0 bibtex-btn" data-bibtex="{{ link.bibtex | escape }}" style="font-size:12px;">
          <i class="fas fa-quote-right"></i> BibTex
        </a>
        {% endif %}
        {% if link.others %}
        {{ link.others }}
        {% endif %}
      </div>
      {% if link.notes %}
      <div class="pub-notes">
        <strong><i>{{ link.notes }}</i></strong>
      </div>
      {% endif %}
      <!-- 显示标签 -->
      {% if link.labels %}
      <div class="tags">
        {% for label in link.labels %}
          {% assign label_class = label | downcase | replace: ", ", "-" | replace: " ", "-" | replace: ",", "" %}
          <span class="tag tag-{{ label_class }}">{{ label }}</span>
        {% endfor %}
      </div>
      {% endif %}
    </div>
  </div>
  </li>
{% endfor %}

</ol>
</div>
