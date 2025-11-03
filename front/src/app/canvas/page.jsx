"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import pen from "../../../public/pen.svg";
import rect from "../../../public/rectangle.svg";
import circle from "../../../public/Circle.png";
import text from "../../../public/Text Box.png";
import eraser from "../../../public/eraser.svg";
import menu from "../../../public/menu.svg";
import buttons from "../../../public/Browser Buttons.png";
import group from "../../../public/group.svg";
import session from "../../../public/share-session.svg";
import people from "../../../public/add-people.svg";
import home from "../../../public/home.svg";
import cross from "../../../public/cross.svg";
import { useRouter } from "next/navigation";
import CreateSession from "../components/createSession";
import JoinSession from "../components/joinSession";
import CreateGroupForm from "../components/createGroup";
import BackgroundCanvas from "../components/backgroundCanvas";
const TOOL_TYPES = {
  PEN: "pen",
  RECTANGLE: "rectangle",
  CIRCLE: "circle",
  TEXT: "text",
  ERASER: "eraser",
};

export default function Canvas() {
  const router = useRouter();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const textInputRef = useRef(null);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [tool, setTool] = useState(TOOL_TYPES.PEN);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);
  const [eraserWidth, setEraserWidth] = useState(16);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [drawings, setDrawings] = useState([]);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [previewShape, setPreviewShape] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showSessionJoin, setShowSessionJoin] = useState(false);
  // Text input states
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [textPos, setTextPos] = useState({ x: 0, y: 0 });
  const [editingTextIndex, setEditingTextIndex] = useState(null);
  const [movingTextIndex, setMovingTextIndex] = useState(null);

  // Track if Text tool is active for new text box on every canvas click
  const [textToolActive, setTextToolActive] = useState(false);
  const [eraserToolActive, setEraserToolActive] = useState(false);
  const [toolActive, setToolActive] = useState(false);
  // Panning states
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  function handleOpenGroupForm() {
    setShowGroupForm(true);
  }
  function handleOpenSessionJoin() {
    setShowSessionJoin(true);
  }
  function handleCloseSessionJoin() {
    setShowSessionJoin(false);
  }
  // Function to close the form
  function handleCloseGroupForm() {
    setShowGroupForm(false);
  }
  // Save existing text input (if any) before starting a new one or moving input
  function handleTextInputSaveIfNeeded() {
    if (!showTextInput) return;

    if (editingTextIndex !== null) {
      setDrawings((prev) => {
        const updated = [...prev];
        updated[editingTextIndex] = {
          ...updated[editingTextIndex],
          text: textInput,
          color,
        };
        return updated;
      });
    } else if (textInput.trim()) {
      setDrawings((prev) => [
        ...prev,
        {
          type: "text",
          x: textPos.x,
          y: textPos.y,
          text: textInput,
          color,
          fontSize: 20,
        },
      ]);
    }

    setTextInput("");
    setEditingTextIndex(null);
  }

  // Click outside input to save text and close input
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showTextInput &&
        textInputRef.current &&
        !textInputRef.current.contains(event.target)
      ) {
        handleTextInputSaveIfNeeded();
        setShowTextInput(false);
        setEditingTextIndex(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTextInput, textInput]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (e) => {
      e.preventDefault();
      setCanvasOffset((offset) => ({
        x: offset.x - e.deltaX,
        y: offset.y - e.deltaY,
      }));
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const preventContextMenu = (e) => e.preventDefault();
    canvas.addEventListener("contextmenu", preventContextMenu);
    return () => {
      canvas.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      redraw();
    }
  }, [
    drawings,
    canvasOffset,
    previewShape,
    editingTextIndex,
    movingTextIndex,
    showTextInput,
  ]);
  function handleMenuToggle() {
    setShowMenu((prev) => !prev);
  }
  function drawCustomBackground(ctx, width, height) {
    // Draw blue linear gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#001f4d"); // Dark blue on top
    gradient.addColorStop(1, "#4a90e2"); // Light blue on bottom

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw white translucent dots covering entire canvas
    const dotRadius = 1.5;
    const spacing = 20;

    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";

    for (let y = 0; y < height; y += spacing) {
      for (let x = 0; x < width; x += spacing) {
        ctx.beginPath();

        // For a nicer pattern, offset every other row:
        const offsetX = (Math.floor(y / spacing) % 2) * (spacing / 2);
        ctx.arc(x + offsetX, y, dotRadius, 0, 2 * Math.PI);

        ctx.fill();
      }
    }
  }

  function redraw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    drawCustomBackground(ctx, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvasOffset.x, canvasOffset.y);

    [...drawings, previewShape].forEach((item, idx) => {
      if (!item) return;
      ctx.strokeStyle = item.color;
      ctx.lineWidth = item.lineWidth;
      ctx.fillStyle = item.color;

      if (item.type === "pen") {
        ctx.beginPath();
        item.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
      } else if (item.type === "eraser") {
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        item.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.lineWidth = item.eraserWidth;
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over";
        ctx.restore();
      } else if (item.type === "rectangle") {
        ctx.strokeRect(item.x, item.y, item.width, item.height);
      } else if (item.type === "circle") {
        ctx.beginPath();
        ctx.ellipse(
          item.x + item.radiusX,
          item.y + item.radiusY,
          Math.abs(item.radiusX),
          Math.abs(item.radiusY),
          0,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      } else if (item.type === "text") {
        ctx.save();
        ctx.font = `${item.fontSize || 20}px sans-serif`;
        ctx.fillStyle = item.color;
        if (editingTextIndex === idx) {
          ctx.strokeStyle = "#5191FA";
          ctx.lineWidth = 2;
          ctx.strokeRect(
            item.x - 2,
            item.y - 22,
            ctx.measureText(item.text).width + 4,
            26
          );
        }
        ctx.fillText(item.text, item.x, item.y);
        ctx.restore();
      }
    });

    ctx.restore();
  }

  function getRelativePos(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left - canvasOffset.x,
      y: e.clientY - rect.top - canvasOffset.y,
    };
  }

  function handleMouseDown(e) {
    const pos = getRelativePos(e);

    if (tool === TOOL_TYPES.TEXT && textToolActive) {
      // Save current text before opening new input
      handleTextInputSaveIfNeeded();

      setTextPos(pos);
      setShowTextInput(true);
      setTextInput("");
      setEditingTextIndex(null);
      setMovingTextIndex(null);
      setIsDrawing(false);
      return;
    }

    if (tool === TOOL_TYPES.RECTANGLE || tool === TOOL_TYPES.CIRCLE) {
      setIsDrawing(true);
      setStartPos(pos);
    } else if (tool === TOOL_TYPES.PEN) {
      setIsDrawing(true);
      setStartPos(pos);
      setDrawings((prev) => [
        ...prev,
        { type: "pen", color, lineWidth, points: [pos] },
      ]);
    } else if (tool === TOOL_TYPES.ERASER) {
      setIsDrawing(true);
      setStartPos(pos);
      setDrawings((prev) => [
        ...prev,
        { type: "eraser", eraserWidth, points: [pos] },
      ]);
    } else if (tool === TOOL_TYPES.TEXT) {
      const idx = drawings.findIndex(
        (item) =>
          item.type === "text" &&
          pos.x >= item.x &&
          pos.x <= item.x + item.text.length * 12 &&
          pos.y <= item.y &&
          pos.y >= item.y - 22
      );
      if (idx !== -1) {
        setMovingTextIndex(idx);
        setStartPos(pos);
      }
    }

    if (e.button === 2 || e.ctrlKey) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  }

  function handleMouseMove(e) {
    const pos = getRelativePos(e);
    if (isDrawing && tool === TOOL_TYPES.PEN) {
      setDrawings((prev) => {
        const updated = [...prev];
        const current = updated[updated.length - 1];
        if (current && current.type === "pen") {
          current.points.push(pos);
        }
        return updated;
      });
    } else if (isDrawing && tool === TOOL_TYPES.ERASER) {
      setDrawings((prev) => {
        const updated = [...prev];
        const current = updated[updated.length - 1];
        if (current && current.type === "eraser") {
          current.points.push(pos);
        }
        return updated;
      });
    } else if (
      isDrawing &&
      (tool === TOOL_TYPES.RECTANGLE || tool === TOOL_TYPES.CIRCLE)
    ) {
      const width = pos.x - startPos.x;
      const height = pos.y - startPos.y;
      if (tool === TOOL_TYPES.RECTANGLE) {
        setPreviewShape({
          type: "rectangle",
          x: startPos.x,
          y: startPos.y,
          width,
          height,
          color,
          lineWidth,
        });
      } else if (tool === TOOL_TYPES.CIRCLE) {
        setPreviewShape({
          type: "circle",
          x: startPos.x,
          y: startPos.y,
          radiusX: width / 2,
          radiusY: height / 2,
          color,
          lineWidth,
        });
      }
    } else if (isPanning) {
      e.preventDefault();
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setCanvasOffset((offset) => ({
        x: offset.x + dx,
        y: offset.y + dy,
      }));
      setPanStart({ x: e.clientX, y: e.clientY });
    } else if (movingTextIndex !== null) {
      setDrawings((prev) => {
        const updated = [...prev];
        if (updated[movingTextIndex]) {
          updated[movingTextIndex] = {
            ...updated[movingTextIndex],
            x: pos.x,
            y: pos.y,
          };
        }
        return updated;
      });
    }
  }

  function handleMouseUp() {
    if (isDrawing && previewShape) {
      setDrawings((prev) => [...prev, previewShape]);
      setPreviewShape(null);
      setIsDrawing(false);
    }
    if (isDrawing && (tool === TOOL_TYPES.PEN || tool === TOOL_TYPES.ERASER)) {
      setIsDrawing(false);
    }
    if (isPanning) setIsPanning(false);
    if (movingTextIndex !== null) {
      setMovingTextIndex(null);
    }
  }

  // Double-click to edit existing text or create new if double-click outside
  function handleDoubleClick(e) {
    const pos = getRelativePos(e);
    const idx = drawings.findIndex(
      (item) =>
        item.type === "text" &&
        pos.x >= item.x &&
        pos.x <= item.x + item.text.length * 12 &&
        pos.y <= item.y &&
        pos.y >= item.y - 22
    );
    if (idx !== -1) {
      setEditingTextIndex(idx);
      setTextInput(drawings[idx].text);
      setShowTextInput(true);
      setTextPos({ x: drawings[idx].x, y: drawings[idx].y });
    } else {
      // New text input on double click outside text
      handleTextInputSaveIfNeeded();
      setEditingTextIndex(null);
      setTextInput("");
      setTextPos(pos);
      setShowTextInput(true);
    }
  }

  // Handle text submit but keep input visible to allow continuous typing
  function handleTextSubmit(e) {
    e.preventDefault();
    if (!textInput.trim() && editingTextIndex === null) {
      setShowTextInput(false);
      setEditingTextIndex(null);
      return;
    }
    if (editingTextIndex !== null) {
      setDrawings((prev) => {
        const updated = [...prev];
        updated[editingTextIndex] = {
          ...updated[editingTextIndex],
          text: textInput,
          color,
        };
        return updated;
      });
    } else {
      setDrawings((prev) => [
        ...prev,
        {
          type: "text",
          x: textPos.x,
          y: textPos.y,
          text: textInput,
          color,
          fontSize: 20,
        },
      ]);
    }
    setTextInput("");
    setShowTextInput(true);
    setEditingTextIndex(null);
  }
  function drawCustomBackground(ctx, width, height) {
    // Draw blue linear gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#001f4d");
    gradient.addColorStop(1, "#4a90e2");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw white translucent dots
    const dotRadius = 1.5;
    const spacing = 20;

    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";

    for (let y = 0; y < height; y += spacing) {
      for (let x = 0; x < width; x += spacing) {
        ctx.beginPath();
        const offsetX = (Math.floor(y / spacing) % 2) * (spacing / 2);
        ctx.arc(x + offsetX, y, dotRadius, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }

  const cursorStyle = isPanning
    ? "grabbing"
    : tool === TOOL_TYPES.PEN
    ? "crosshair"
    : tool === TOOL_TYPES.ERASER
    ? "cell"
    : "default";

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        userSelect: "none",
        overflow: "hidden",
        background: "white",
      }}
    >
      <div
        className="px-2 py-2 h-10 w-10 absolute left-10 top-8 border border-white/50 rounded-lg bg-white/50 shadow-md cursor-pointer"
        onClick={handleMenuToggle}
      >
        <Image src={menu} alt="menu" width={20} height={20} />
      </div>
      <div
        style={{ position: "absolute", right: "2%", top: 200, zIndex: 10 }}
        className="flex flex-col gap-7 bg-white/50 rounded-2xl shadow-md border-2 border-white/20 py-2 px-6 justify-between"
      >
        <button
          onClick={() => {
            setTool(TOOL_TYPES.PEN);
            setTextToolActive(false);
          }}
          className="cursor-pointer hover:bg-white/60 hover:p-1 hover:border hover:border-blue-50 hover:rounded-lg"
        >
          <Image src={pen} alt="Pen" width={20} height={20} />
        </button>
        <button
          onClick={() => {
            setTool(TOOL_TYPES.RECTANGLE);
            setTextToolActive(false);
          }}
          className="cursor-pointer hover:bg-white/60 hover:p-1 hover:border hover:border-blue-50 hover:rounded-lg"
        >
          <Image src={rect} alt="Rectangle" width={24} height={24} />
        </button>
        <button
          onClick={() => {
            setTool(TOOL_TYPES.CIRCLE);
            setTextToolActive(false);
          }}
          className="cursor-pointer hover:bg-white/60 hover:p-1 hover:border hover:border-blue-50 hover:rounded-lg"
        >
          <Image src={circle} alt="Circle" width={22} height={22} />
        </button>
        <button
          onClick={() => {
            setTool(TOOL_TYPES.TEXT);
            setTextToolActive(true);
            setToolActive(false);
          }}
          className={`cursor-pointer p-1 rounded-lg transition-all duration-200
    ${
      textToolActive
        ? "bg-blue-200 border border-blue-400"
        : "hover:bg-white/60 hover:border hover:border-blue-50"
    }
  `}
        >
          <Image src={text} alt="text" width={22} height={22} />
        </button>

        <button
          onClick={() => {
            setTool(TOOL_TYPES.ERASER);
            setEraserToolActive(true);
            setToolActive(true);
          }}
          className={`cursor-pointer p-1 rounded-lg transition-all duration-200
    ${
      eraserToolActive
        ? "bg-blue-200 border border-blue-400"
        : "hover:bg-white/60 hover:border hover:border-blue-50"
    }`}
        >
          <Image src={eraser} alt="eraser" width={22} height={22} />
        </button>

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          title="Stroke/Fill color"
          style={{
            width: "25px",
            height: "30px",
            padding: 0,
          }}
        />
        {/* <input
          type="range"
          min={1}
          max={10}
          value={lineWidth}
          onChange={(e) => setLineWidth(parseInt(e.target.value, 10))}
          title="Line width"
        /> */}
        {tool === TOOL_TYPES.ERASER && (
          <input
            type="range"
            min={5}
            max={30}
            value={eraserWidth}
            onChange={(e) => setEraserWidth(parseInt(e.target.value, 10))}
            title="Eraser width"
          />
        )}
      </div>
      {showMenu && (
        <div className="absolute top-14 left-14 w-[220px] h-[300px] bg-white/50 z-50 border border-white/40 rounded-lg shadow-md p-4">
          <div>
            <Image src={buttons} alt="buttons" height={30} width={50} />
          </div>
          <div className="flex flex-col text-black font-raleway font-medium gap-3 p-4">
            <button
              onClick={() => {
                router.push("/");
              }}
              className="flex items-center gap-3 cursor-pointer ml-1"
            >
              <Image src={home} alt="home" width={28} height={24} />
              <div> Go to Home</div>
            </button>
            <div className="w-[150px] border border-black/20"></div>
            <button
              onClick={() => {
                handleOpenGroupForm();
                handleMenuToggle(); // close menu if needed
              }}
              className="flex items-center gap-3 cursor-pointer ml-2"
            >
              <Image src={group} alt="group" width={20} height={20} />
              <div> Create group</div>
            </button>
            <div className="w-[150px] border border-black/20"></div>
            <button
              onClick={() => {
                handleOpenSessionJoin();
                handleMenuToggle(); // close menu if needed
              }}
              className="flex items-center gap-3 cursor-pointer ml-1"
            >
              <Image src={session} alt="session" width={20} height={20} />
              <div> Create session</div>
            </button>
            <div className="w-[150px] border border-black/20"></div>
            <button
              onClick={() => {
                router.push("/");
              }}
              className="flex items-center gap-5 ml-1 cursor-pointer"
            >
              <Image src={people} alt="people" width={24} height={20} />
              <div>Add People</div>
            </button>
            <div className="w-[150px] border border-black/20"></div>

            <button
              onClick={handleMenuToggle}
              className="flex items-center gap-5 ml-1 cursor-pointer"
            >
              <Image src={cross} alt="close menu" width={24} height={24} />
              <div> Close Menu</div>
            </button>
          </div>
        </div>
      )}
      {showTextInput && (
        <form
          onSubmit={handleTextSubmit}
          style={{
            position: "absolute",
            top: textPos.y + canvasOffset.y,
            left: textPos.x + canvasOffset.x,
            zIndex: 20,
          }}
        >
          <input
            ref={textInputRef}
            autoFocus
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter text"
            style={{ fontSize: 20 }}
            className="border-none outline-none"
          />
        </form>
      )}
      {showSessionJoin && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={handleCloseSessionJoin} // click outside closes modal
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside form
          >
            <CreateSession />
          </div>
        </div>
      )}
      {showGroupForm && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={handleCloseGroupForm} // click outside closes modal
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside form
          >
            <CreateGroupForm
              token={localStorage.getItem("token")} // or pass token from context
            />
            <button
              className="absolute top-2 right-2 text-white text-xl font-bold"
              onClick={handleCloseGroupForm}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{
          touchAction: "none",
          cursor: cursorStyle,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      />
    </div>
  );
}
