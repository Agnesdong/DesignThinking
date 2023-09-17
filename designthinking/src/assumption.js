import React, {useEffect} from 'react';
import './Assumption.css';
import { PiStickerLight } from "react-icons/pi";
import { BsArrowUpRight } from "react-icons/bs";
import { AiOutlineAlignLeft } from "react-icons/ai";
import { AiOutlinePicture } from "react-icons/ai";
import { IoShapesOutline } from "react-icons/io5";
import { BsTextareaT } from "react-icons/bs";
import { LiaHighlighterSolid } from "react-icons/lia";
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { PiKeyReturn } from 'react-icons/pi';

function Assumption() {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = 'visible';
        };
      }, []);
  return (
    <div className="assumption">
      <div className="left-part">

        <div className="tab-bar">
            <div className="tab-title">Assumptions and Questions</div>

            <div class="vertical-line"></div>
          
            <div className="icons">
                <div className="icon-item">
                    <PiStickerLight />
                    <div className="icon-text">Sticker</div>
                </div>
                <div className="icon-item">
                    <BsArrowUpRight />
                    <div className="icon-text">Arrow</div>
                </div>
                <div className="icon-item">
                    <AiOutlineAlignLeft />
                    <div className="icon-text">Line</div>
                </div>
                <div className="icon-item">
                    <AiOutlinePicture />
                    <div className="icon-text">Picture</div>
                </div>
                <div className="icon-item">
                    <IoShapesOutline />
                    <div className="icon-text">Shape</div>
                </div>
                <div className="icon-item">
                    <BsTextareaT />
                    <div className="icon-text">Text</div>
                </div>
                <div className="icon-item">
                    <LiaHighlighterSolid />
                    <div className="icon-text">Highlight</div>
                </div>
            </div>

            <div class="small-vertical-line"></div>
            <div className="close">
                <div className='close-icon'>
                    <PiKeyReturn />
                </div>
                <div className='close-icon'>
                    <AiOutlineCloseCircle />
                </div>
            </div>

        </div>
        <div class="separator-line"></div>

        <div className='scrollable-content'>
            <div className='Axis'>
                <div className="DirectionTextRisk">High Risk</div>
                <div className="CoordinateAxisContainer">
                    <div className="DirectionText">Uncertainty</div>
                    <div className="CoordinateAxis" />
                    <div className="DirectionText">Certainty</div>
                </div>
                <div className="DirectionTextRisk">Low Risk</div>
            </div>
        </div>

      </div>
      <div className="right-part">
        {}
      </div>
    </div>
  )
}

export default Assumption