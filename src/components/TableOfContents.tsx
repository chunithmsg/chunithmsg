const TableOfContents = ({
  contents,
}: {
  contents: { level: number; id: string; title: string }[];
}) => (
  <ul>
    {contents.map(({ id, title }) => (
      <li key={id}>
        <a href={`#${id}`}>{title}</a>
      </li>
    ))}
  </ul>
);

export default TableOfContents;
