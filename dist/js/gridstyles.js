calculateGridStyles(event) {
    const { horizontalOffset, verticalOffset } = this.offsets;
    const containerWidth = event.target.innerWidth - horizontalOffset;
    const containerHeight = event.target.innerHeight - verticalOffset;
    const gridContainer = document.querySelector('.grid-view') as HTMLElement;
    const participants = gridContainer.querySelectorAll('.participant');

    const getRows = (columns, participantCount) => Math.ceil(participantCount / columns);
    const getGridRatio = (columns, rows) => columns / rows;
    const getVerticalFit = (rows, columns, containerWidth, containerHeight) => {
      const marginOffset = (rows - 1) * 16;
      const heightPerFeed = (containerHeight - marginOffset) / rows;
      const widthPerFeed = heightPerFeed * (16 / 9);
      const areaPerFeed = heightPerFeed * widthPerFeed;
      const totalWidth = widthPerFeed * columns;
      const margin = containerWidth - marginOffset - totalWidth;
      return { heightPerFeed, widthPerFeed, areaPerFeed, totalWidth, margin };
    };
    const getHorizontalFit = (rows, columns, containerWidth, containerHeight) => {
      const marginOffset = (columns - 1) * 16;
      const widthPerFeed = (containerWidth - marginOffset) / columns;
      const heightPerFeed = widthPerFeed * (9 / 16);
      const areaPerFeed = heightPerFeed * widthPerFeed;
      const totalHeight = heightPerFeed * rows;
      const margin = containerHeight - marginOffset - totalHeight;
      return { heightPerFeed, widthPerFeed, areaPerFeed, totalHeight, margin };
    };

    const getGridOption = gridOptions => {
      const areasPerFeed = gridOptions.map(option => option.areaPerFeed);
      const highestAreaPerFeed = Math.max(...areasPerFeed);
      return gridOptions.find(option => option.areaPerFeed === highestAreaPerFeed);
    };

    const generateGridOptions = maxColumns => {
      const gridOptions = [];
      for (let columns = 1; columns <= maxColumns; columns++) {
        const rows = getRows(columns, participants.length);
        const gridRatio = getGridRatio(columns, rows);
        const verticalFit = {
          rows,
          columns,
          gridRatio,
          ...getVerticalFit(rows, columns, containerWidth, containerHeight)
        };
        const horizontalFit = {
          rows,
          columns,
          gridRatio,
          ...getHorizontalFit(rows, columns, containerWidth, containerHeight)
        };
        if (verticalFit.margin > 0) {
          gridOptions.push(verticalFit);
        }
        if (horizontalFit.margin > 0) {
          gridOptions.push(horizontalFit);
        }
      }
      return gridOptions;
    };

    const gridOptions = generateGridOptions(participants.length);
    const gridOption = getGridOption(gridOptions);
    if (gridOption) {
      const { rows, columns, widthPerFeed, heightPerFeed } = gridOption;
      this.feedDimensions = {
        'width.px': widthPerFeed,
        'height.px': heightPerFeed
      };
      const gridStyles = {
        'grid-template-columns': `repeat(${columns}, ${widthPerFeed}px)`,
        'grid-template-rows': `repeat(${rows}, ${heightPerFeed}px)`
      };
      this.resized.emit(gridStyles);
    }
  }