"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Affix, Col, Row } from "antd";
import { useWindowSize } from "@/utils/useWindowSize";
import rules from "./rules.md";

const Rules = () => {
  const { width } = useWindowSize();

  // https://gist.github.com/sobelk/16fe68ff5520b2d5e2b6d406e329e0de
  const toc: {
    level: number;
    id: string;
    title: string;
  }[] = [];

  // Magic.
  const addToTOC = ({ children, ...props }: React.PropsWithChildren<any>) => {
    const level = Number(props.node.tagName.match(/h(\d)/)?.slice(1));
    if (level && children && typeof children[0] === "string") {
      const id = children[0].toLowerCase().replace(/[^a-z0-9]+/g, "-");
      toc.push({
        level,
        id,
        title: children[0],
      });
      return React.createElement(props.node.tagName, { id }, children);
    } else {
      return React.createElement(props.node.tagName, props, children);
    }
  };

  const TOC = () => (
    <ul>
      {toc.map(({ level, id, title }) => (
        <li key={id}>
          <a href={`#${id}`}>{title}</a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <h1>Rules</h1>
      <Row>
        <Col span={16} order={2}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: addToTOC,
            }}
          >
            {/*
            The submission URL within the page is hard-coded.
            TODO: Remove the magic constant and use the constants.ts file instead.
            */}
            {rules}
          </ReactMarkdown>
        </Col>
        {width && width > 450 && (
          <Col span={8} order={1}>
            <Affix>
              <TOC />
            </Affix>
          </Col>
        )}
      </Row>
    </>
  );
};

export default Rules;
