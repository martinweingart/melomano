import "./ListRender.scss";
import { ListRenderItem } from "./ListRenderItem/ListRenderItem";
import { getImageUrl } from "../../Services/media";

export const ListRender = function ({
  className = "",
  list,
  type,
  title,
  subtitle,
  id,
  onClick,
  ...props
}) {
  return (
    <div className={className}>
      <ul>
        {list.map((item) => (
          <ListRenderItem
            key={`ListRenderItem-${item[id]}`}
            id={item[id]}
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
