import "./ListRender.scss";
import React from "react";
import { ListRenderItem } from "./ListRenderItem/ListRenderItem";
import { getImageUrl } from "../../Services/media";

export const ListRender = function ({
  className = "",
  list,
  type,
  title,
  subtitle,
  onClick,
  onScrollBottom,
  ...props
}) {
  const onScroll = (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight) {
      onScrollBottom && onScrollBottom();
    }
  };

  return (
    <div className={className} onScroll={onScroll}>
      <ul>
        {list.map((item) => (
          <ListRenderItem
            key={`ListRenderItem-${item.id}`}
            id={item.id}
            type={type}
            title={item[title]}
            subtitle={item[subtitle]}
            image={getImageUrl(item.image)}
            onClick={() => onClick(item)}
            {...props}
          />
        ))}
      </ul>
    </div>
  );
};
