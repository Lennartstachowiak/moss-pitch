interface PresentationState {
  currentImage: string | null;
}

class Storage {
  private state: PresentationState = {
    currentImage: null
  };

  getCurrentImage(): string | null {
    return this.state.currentImage;
  }

  setCurrentImage(imageUrl: string): void {
    this.state.currentImage = imageUrl;
  }

  getState(): PresentationState {
    return { ...this.state };
  }
}

export const storage = new Storage();