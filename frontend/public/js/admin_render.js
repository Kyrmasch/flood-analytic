Object.assign(render, {
  relation_name: function render(data, type, full, meta, fieldOptions) {
      if (!data) return null_column();
      if (Array.isArray(data) && data.length == 0) return empty_column();
      data = Array.isArray(data) ? data : [data];
      if (type != "display") return data.map((d) => d._meta.repr).join(",");
      return `<div class="d-flex flex-row">${data
        .map(
          (e) =>
            `<a class='mx-1 btn-link' href="${e._meta.detailUrl}"><span class='m-1 py-1 px-2 badge bg-blue-lt lead d-inline-block text-truncate' data-toggle="tooltip" data-placement="bottom" title='${e.name}'  style="max-width: 20em;">${e.name}</span></a>`
        )
        .join("")}</div>`;
  },
});